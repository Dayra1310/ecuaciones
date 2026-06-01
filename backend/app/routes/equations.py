import re

from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DifferentialEquationRequest,
    DifferentialEquationResponse,
    ExpressionValidationRequest,
    PopulationGrowthRequest,
    PopulationGrowthResponse,
    RadioactiveDecayRequest,
    RadioactiveDecayResponse,
    C14DatingRequest,
    C14DatingResponse,
    NewtonCoolingRequest,
    NewtonCoolingResponse,
    StepDetail,
)
from app.services.ode_solver import solve_differential_equation
import sympy as sp

router = APIRouter(prefix="/equations", tags=["Equations"])


def _real_solution(solutions: list) -> float:
    for sol in solutions:
        if sol.is_real:
            return float(sol)
    return float(solutions[0])


def _classify_ode(ode, func):
    classes = [c for c in sp.classify_ode(ode, func) if not c.endswith("_Integral")]
    is_linear = any("linear" in c for c in classes)
    derivs = ode.atoms(sp.Derivative)
    order = max(
        sum(arg[1] if isinstance(arg, tuple) else 1 for arg in d.args[1:])
        for d in derivs
    ) if derivs else 0
    return is_linear, order


@router.post("/solve", response_model=DifferentialEquationResponse)
def solve_equation(req: DifferentialEquationRequest):
    try:
        def preprocess(val: str) -> str:
            return re.sub(r"(\d)([a-zA-Z]+)", lambda m: m[1] + "*" + "*".join(m[2]), val).replace("^", "**")
        M = preprocess(req.M)
        N = preprocess(req.N)
        result = solve_differential_equation(M, N, req.variable)
        return DifferentialEquationResponse(**result)
    except (sp.SympifyError, ValueError) as e:
        raise HTTPException(status_code=400, detail=f"Error al parsear la expresión: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error interno: {str(e)}")


@router.post("/validate")
def validate_expression(req: ExpressionValidationRequest):
    try:
        sp.sympify(req.expression)
        return {"valid": True}
    except (sp.SympifyError, ValueError):
        return {"valid": False}


@router.post("/population-growth", response_model=PopulationGrowthResponse)
def population_growth(req: PopulationGrowthRequest):
    if req.P0 <= 0 or req.P <= 0:
        raise HTTPException(status_code=400, detail="P0 y P deben ser positivos")
    if req.t <= 0:
        raise HTTPException(status_code=400, detail="El tiempo debe ser positivo")

    t, k = sp.symbols("t k")
    P = sp.Function("P")
    ode = sp.Eq(sp.Derivative(P(t), t), k * P(t))

    is_linear, order = _classify_ode(ode, P(t))
    general = sp.dsolve(ode, P(t))
    particular = sp.dsolve(ode, P(t), ics={P(0): req.P0})
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.P), k))
    final_sol = particular.rhs.subs(k, k_val)

    P_sym, C1 = sp.symbols("P C1")
    lhs_int = sp.integrate(1 / P_sym, P_sym)
    rhs_int = sp.integrate(k, (t,))

    steps: list[StepDetail] = []

    steps.append(StepDetail(
        title="Paso 1: Identificación del problema y planteamiento",
        substeps=[
            "Modelo: Crecimiento poblacional exponencial",
            "",
            "Datos proporcionados:",
            f"  • P₀ = {req.P0} (población inicial en t = 0)",
            f"  • P = {req.P} (población en t = {req.t})",
            f"  • t = {req.t} (tiempo)",
            "",
            "Ecuación diferencial del modelo:",
            f"  {ode}",
        ]
    ))

    lineal_str = "sí" if is_linear else "no"
    steps.append(StepDetail(
        title="Paso 2: Clasificación con SymPy",
        substeps=[
            "SymPy clasifica la EDO automáticamente:",
            f"  • Orden: {order}",
            f"  • ¿Es lineal?: {lineal_str}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Separación de variables con SymPy",
        substeps=[
            "SymPy realiza la separación de variables:",
            "",
            "  dP/dt = k·P  →  dP/P = k·dt",
            "",
            "Integrando ambos lados simbólicamente:",
            f"  ∫ 1/P dP = {lhs_int}",
            f"  ∫ k dt  = {rhs_int}",
            f"  {lhs_int} = {rhs_int} + C₁",
            "",
            "Despejando P con SymPy:",
            f"  P(t) = {general.rhs}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Solución particular con SymPy",
        substeps=[
            "SymPy aplica la condición inicial P(0) = P₀ usando `ics`:",
            f"  {particular}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 5: Cálculo de k con SymPy",
        substeps=[
            "SymPy resuelve para k usando el segundo dato:",
            f"  Ecuación: {sp.Eq(particular.rhs.subs(t, req.t), req.P)}",
            f"  Solución: k = {sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.P), k)[0]}",
            f"  k = {k_val:.6g}",
            "",
            "Ecuación final del modelo:",
            f"  P(t) = {final_sol}",
        ]
    ))

    return PopulationGrowthResponse(
        k=round(k_val, 6),
        solution=f"P(t) = {final_sol}",
        steps=steps,
    )


@router.post("/radioactive-decay", response_model=RadioactiveDecayResponse)
def radioactive_decay(req: RadioactiveDecayRequest):
    if req.A1 <= 0 or req.A2 <= 0:
        raise HTTPException(status_code=400, detail="A1 y A2 deben ser positivos")
    if req.t <= 0:
        raise HTTPException(status_code=400, detail="El tiempo debe ser positivo")
    if req.A2 >= req.A1:
        raise HTTPException(status_code=400, detail="A2 debe ser menor que A1 (la cantidad disminuye con el tiempo)")

    t, k = sp.symbols("t k")
    A = sp.Function("A")
    ode = sp.Eq(sp.Derivative(A(t), t), -k * A(t))

    is_linear, order = _classify_ode(ode, A(t))
    general = sp.dsolve(ode, A(t))
    particular = sp.dsolve(ode, A(t), ics={A(0): req.A1})
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.A2), k))
    final_sol = particular.rhs.subs(k, k_val)
    half_life = float(sp.log(2) / k_val)

    A_sym = sp.symbols("A")
    lhs_int = sp.integrate(1 / A_sym, A_sym)
    rhs_int = sp.integrate(-k, (t,))

    steps: list[StepDetail] = []

    steps.append(StepDetail(
        title="Paso 1: Identificación del problema y planteamiento",
        substeps=[
            "Modelo: Decaimiento radiactivo",
            "",
            "Datos proporcionados:",
            f"  • A₀ = A₁ = {req.A1} (cantidad inicial en t = 0)",
            f"  • A = A₂ = {req.A2} (cantidad en t = {req.t})",
            f"  • t = {req.t} (tiempo)",
            "",
            "Ecuación diferencial del modelo:",
            f"  {ode}",
        ]
    ))

    lineal_str = "sí" if is_linear else "no"
    steps.append(StepDetail(
        title="Paso 2: Clasificación con SymPy",
        substeps=[
            "SymPy clasifica la EDO automáticamente:",
            f"  • Orden: {order}",
            f"  • ¿Es lineal?: {lineal_str}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Separación de variables con SymPy",
        substeps=[
            "SymPy realiza la separación de variables:",
            "",
            "  dA/dt = -k·A  →  dA/A = -k·dt",
            "",
            "Integrando ambos lados simbólicamente:",
            f"  ∫ 1/A dA = {lhs_int}",
            f"  ∫ -k dt  = {rhs_int}",
            f"  {lhs_int} = {rhs_int} + C₁",
            "",
            "Despejando A con SymPy:",
            f"  A(t) = {general.rhs}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Solución particular con SymPy",
        substeps=[
            "SymPy aplica la condición inicial A(0) = A₁ usando `ics`:",
            f"  {particular}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 5: Cálculo de k con SymPy",
        substeps=[
            "SymPy resuelve para k usando el segundo dato:",
            f"  Ecuación: {sp.Eq(particular.rhs.subs(t, req.t), req.A2)}",
            f"  Solución: k = {sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.A2), k)[0]}",
            f"  k = {k_val:.6g}",
            "",
            "Ecuación final del modelo:",
            f"  A(t) = {final_sol}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 6: Cálculo de la vida media (T₁/₂) con SymPy",
        substeps=[
            "La vida media cumple: A(T₁/₂) = A₀ / 2",
            "",
            "SymPy resuelve simbólicamente:",
            f"  {sp.Eq(final_sol.subs(t, sp.Symbol('T')), req.A1 / 2)}",
            "  e^(-k·T₁/₂) = 1/2",
            "  -k · T₁/₂ = ln(1/2) = -ln(2)",
            f"  T₁/₂ = ln(2) / {k_val:.6g}",
            f"  T₁/₂ = {half_life:.4f} horas",
        ]
    ))

    return RadioactiveDecayResponse(
        k=round(k_val, 6),
        half_life=round(half_life, 4),
        solution=f"A(t) = {final_sol}",
        steps=steps,
    )


@router.post("/c14-dating", response_model=C14DatingResponse)
def c14_dating(req: C14DatingRequest):
    if req.N0 <= 0 or req.N <= 0:
        raise HTTPException(status_code=400, detail="N₀ y N deben ser positivos")
    if req.N >= req.N0:
        raise HTTPException(status_code=400, detail="N debe ser menor que N₀ (la cantidad disminuye con el tiempo)")

    import math
    HALF_LIFE_C14 = 5730
    k_val = math.log(2) / HALF_LIFE_C14

    t, k = sp.symbols("t k")
    N = sp.Function("N")
    ode = sp.Eq(sp.Derivative(N(t), t), -k * N(t))

    is_linear, order = _classify_ode(ode, N(t))
    general = sp.dsolve(ode, N(t))
    particular = sp.dsolve(ode, N(t), ics={N(0): req.N0})

    particular_known = particular.subs(k, sp.log(2) / HALF_LIFE_C14)
    age = _real_solution(sp.solve(sp.Eq(particular_known.rhs, req.N), t))

    ratio = req.N / req.N0
    n_half = round(math.log(req.N0 / req.N) / math.log(2))
    is_power_of_half = abs(math.log(ratio, 0.5) - round(math.log(ratio, 0.5))) < 1e-9

    steps: list[StepDetail] = []

    steps.append(StepDetail(
        title="Paso 1: Identificación del problema y planteamiento",
        substeps=[
            "Modelo: Datación por Carbono-14",
            "",
            "Datos proporcionados:",
            f"  • N₀ = {req.N0}% (concentración inicial de ¹⁴C)",
            f"  • N = {req.N}% (concentración actual de ¹⁴C en la muestra)",
            "",
            f"Semivida del ¹⁴C: {HALF_LIFE_C14} años",
            "",
            "Ecuación diferencial del modelo:",
            f"  dN/dt = -k·N   con k = ln(2)/{HALF_LIFE_C14}",
        ]
    ))

    lineal_str = "sí" if is_linear else "no"
    steps.append(StepDetail(
        title="Paso 2: Clasificación con SymPy",
        substeps=[
            "SymPy clasifica la EDO automáticamente:",
            f"  • Orden: {order}",
            f"  • ¿Es lineal?: {lineal_str}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Solución general con SymPy",
        substeps=[
            "SymPy resuelve la EDO simbólicamente:",
            f"  {general}",
            "",
            "Sustituimos k por su valor conocido:",
            f"  k = ln(2) / {HALF_LIFE_C14} = {k_val:.8g}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Solución particular con SymPy",
        substeps=[
            "SymPy aplica la condición inicial N(0) = N₀:",
            f"  N(t) = {particular_known.rhs}",
        ]
    ))

    if is_power_of_half:
        steps.append(StepDetail(
            title="Paso 5: Cálculo de la edad con SymPy",
            substeps=[
                "SymPy resuelve la ecuación N(t) = N% actual:",
                f"  Ecuación: {sp.Eq(particular_known.rhs, req.N)}",
                f"  (N es exactamente N₀ / 2^{n_half})",
                "",
                f"  t = {n_half} · {HALF_LIFE_C14} = {age:.2f} años",
            ]
        ))
    else:
        steps.append(StepDetail(
            title="Paso 5: Cálculo de la edad con SymPy",
            substeps=[
                "SymPy resuelve la ecuación N(t) = N% actual:",
                f"  Ecuación: {sp.Eq(particular_known.rhs, req.N)}",
                "",
                f"  t = {age:.2f} años",
            ]
        ))

    return C14DatingResponse(
        k=round(k_val, 8),
        age=round(age, 2),
        solution=f"N(t) = {req.N0} · e^(-{k_val:.8g} · t)",
        steps=steps,
    )


@router.post("/newton-cooling", response_model=NewtonCoolingResponse)
def newton_cooling(req: NewtonCoolingRequest):
    if req.T0 == req.Tm:
        raise HTTPException(status_code=400, detail="La temperatura inicial no puede ser igual a la ambiente")
    if req.t <= 0:
        raise HTTPException(status_code=400, detail="El tiempo debe ser positivo")

    t, k = sp.symbols("t k")
    T = sp.Function("T")
    Tm = sp.symbols("Tm")
    ode = sp.Eq(sp.Derivative(T(t), t), k * (T(t) - Tm))

    is_linear, order = _classify_ode(ode, T(t))
    general = sp.dsolve(ode, T(t))
    particular = sp.dsolve(ode, T(t), ics={T(0): req.T0}).subs(Tm, req.Tm)
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.T), k))
    final_sol = particular.rhs.subs(k, k_val)

    T_sym, C1 = sp.symbols("T C1")
    lhs_int = sp.integrate(1 / (T_sym - Tm), (T_sym,))
    rhs_int = sp.integrate(k, (t,))

    steps: list[StepDetail] = []

    steps.append(StepDetail(
        title="Paso 1: Identificación del problema y planteamiento",
        substeps=[
            "Modelo: Ley de Enfriamiento de Newton",
            "",
            "Datos proporcionados:",
            f"  • Tₘ = {req.Tm} ° (temperatura ambiente, constante)",
            f"  • T₀ = {req.T0} ° (temperatura inicial en t = 0)",
            f"  • T = {req.T} ° (temperatura en t = {req.t})",
            f"  • t = {req.t} (tiempo)",
            "",
            "Ecuación diferencial del modelo:",
            f"  dT/dt = k·(T - {req.Tm})",
        ]
    ))

    lineal_str = "sí" if is_linear else "no"
    steps.append(StepDetail(
        title="Paso 2: Clasificación con SymPy",
        substeps=[
            "SymPy clasifica la EDO automáticamente:",
            f"  • Orden: {order}",
            f"  • ¿Es lineal?: {lineal_str}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Separación de variables con SymPy",
        substeps=[
            "SymPy realiza la separación de variables:",
            "",
            "  dT/dt = k·(T - Tₘ)  →  dT/(T - Tₘ) = k·dt",
            "",
            "Integrando ambos lados simbólicamente:",
            f"  ∫ 1/(T - Tₘ) dT = {lhs_int}",
            f"  ∫ k dt  = {rhs_int}",
            f"  {lhs_int} = {rhs_int} + C₁",
            "",
            "Despejando T con SymPy:",
            f"  {general}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Solución particular con SymPy",
        substeps=[
            "SymPy aplica la condición inicial T(0) = T₀ usando `ics`:",
            f"  T(t) = {particular.rhs}",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 5: Cálculo de k con SymPy",
        substeps=[
            "SymPy resuelve para k usando el segundo dato:",
            f"  Ecuación: {sp.Eq(particular.rhs.subs(t, req.t), req.T)}",
            f"  Solución: k = {sp.solve(sp.Eq(particular.rhs.subs(t, req.t), req.T), k)[0]}",
            f"  k = {k_val:.6g}",
            "",
            "Ecuación final del modelo:",
            f"  T(t) = {final_sol}",
        ]
    ))

    return NewtonCoolingResponse(
        k=round(k_val, 6),
        solution=f"T(t) = {final_sol}",
        steps=steps,
    )
