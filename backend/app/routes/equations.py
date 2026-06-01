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

    k_sym = sp.symbols("k")
    eq = sp.Eq(req.P0 * sp.exp(k_sym * req.t), req.P)
    k = float(sp.solve(eq, k_sym)[0])
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
            "  dP/dt = k·P",
            "",
            "Donde:",
            "  • dP/dt = tasa de cambio de la población",
            "  • P = población en el tiempo t",
            "  • k = constante de crecimiento (a determinar)",
            "  • t = tiempo",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 2: Clasificación de la ecuación diferencial",
        substeps=[
            "La ecuación dP/dt = k·P es una Ecuación Diferencial Ordinaria (EDO).",
            "",
            "Clasificación:",
            "  • Orden: 1er orden",
            "  • Grado: 1",
            "  • Lineal: Sí",
            "  • Separable: Sí",
            "  • Homogénea: Sí",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Resolución por variables separables",
        substeps=[
            "Para resolver dP/dt = k·P, separamos las variables:",
            "",
            "Paso 3.1: Escribir en forma diferencial",
            "  dP/dt = k·P",
            "",
            "Paso 3.2: Separar variables P y t",
            "  Multiplicamos por dt y dividimos por P:",
            "  dP/P = k·dt",
            "",
            "Paso 3.3: Integrar ambos lados",
            "  ∫ dP/P = ∫ k·dt",
            "",
            "Paso 3.4: Aplicar la integral",
            "  ln|P| = k·t + C",
            "  Donde C es la constante de integración.",
            "",
            "Paso 3.5: Despejar P aplicando exponencial",
            "  e^(ln|P|) = e^(k·t + C)",
            "  |P| = e^C · e^(k·t)",
            "",
            "Paso 3.6: Simplificar (P > 0 para población)",
            "  P(t) = C₁ · e^(k·t)",
            "  Donde C₁ = e^C es una constante positiva.",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Determinar la función P(t) y calcular k",
        substeps=[
            "Paso 4.1: Usar la condición inicial para encontrar C₁",
            "  En t = 0: P(0) = P₀",
            "",
            f"  Sustituimos t = 0 en P(t) = C₁ · e^(k·t):",
            f"  P(0) = C₁ · e^(k·0) = C₁ · e⁰ = C₁ · 1 = C₁",
            "",
            f"  Como P(0) = {req.P0}:",
            f"  C₁ = {req.P0}",
            "",
            "Paso 4.2: Escribir la solución particular",
            f"  P(t) = {req.P0} · e^(k·t)",
            "",
            "Paso 4.3: Usar el segundo dato para encontrar k",
            f"  En t = {req.t}: P({req.t}) = {req.P}",
            "",
            f"  Sustituimos en la solución particular:",
            f"  {req.P} = {req.P0} · e^(k·{req.t})",
            "",
            "Paso 4.4: Despejar el término exponencial",
            f"  e^(k·{req.t}) = {req.P} / {req.P0}",
            f"  e^(k·{req.t}) = {req.P/req.P0:.6g}",
            "",
            "Paso 4.5: Aplicar logaritmo natural",
            f"  ln(e^(k·{req.t})) = ln({req.P/req.P0:.6g})",
            f"  k · {req.t} = {float(sp.log(req.P/req.P0)):.6g}",
            "",
            "Paso 4.6: Despejar k",
            f"  k = {float(sp.log(req.P/req.P0)):.6g} / {req.t}",
            f"  k = {k:.6g}",
            "",
            "Paso 4.7: Ecuación final del modelo",
            f"  Sustituyendo k = {k:.6g}:",
            f"  P(t) = {req.P0} · e^({k:.6g} · t)",
        ]
    ))

    return PopulationGrowthResponse(
        k=round(k, 6),
        solution=f"P(t) = {req.P0} · e^({k:.6g} · t)",
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

    k_sym = sp.symbols("k")
    eq = sp.Eq(req.A1 * sp.exp(-k_sym * req.t), req.A2)
    k = float(sp.solve(eq, k_sym)[0])
    half_life = float(sp.log(2) / k)
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
            "  dA/dt = -k·A",
            "",
            "Donde:",
            "  • dA/dt = tasa de cambio de la cantidad",
            "  • A = cantidad en el tiempo t",
            "  • k = constante de decaimiento (positiva)",
            "  • El signo negativo indica que la cantidad disminuye",
            "  • t = tiempo",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 2: Clasificación de la ecuación diferencial",
        substeps=[
            "La ecuación dA/dt = -k·A es una Ecuación Diferencial Ordinaria (EDO).",
            "",
            "Clasificación:",
            "  • Orden: 1er orden",
            "  • Grado: 1",
            "  • Lineal: Sí",
            "  • Separable: Sí",
            "  • Homogénea: Sí",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Resolución por variables separables",
        substeps=[
            "Para resolver dA/dt = -k·A, separamos las variables:",
            "",
            "Paso 3.1: Escribir en forma diferencial",
            "  dA/dt = -k·A",
            "",
            "Paso 3.2: Separar variables A y t",
            "  Multiplicamos por dt y dividimos por A:",
            "  dA/A = -k·dt",
            "",
            "Paso 3.3: Integrar ambos lados",
            "  ∫ dA/A = ∫ -k·dt",
            "",
            "Paso 3.4: Aplicar la integral",
            "  ln|A| = -k·t + C",
            "  Donde C es la constante de integración.",
            "",
            "Paso 3.5: Despejar A aplicando exponencial",
            "  e^(ln|A|) = e^(-k·t + C)",
            "  |A| = e^C · e^(-k·t)",
            "",
            "Paso 3.6: Simplificar (A > 0 para sustancia)",
            "  A(t) = C₁ · e^(-k·t)",
            "  Donde C₁ = e^C es una constante positiva.",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Determinar la función A(t) y calcular k",
        substeps=[
            "Paso 4.1: Usar la condición inicial para encontrar C₁",
            "  En t = 0: A(0) = A₀ = A₁",
            "",
            f"  Sustituimos t = 0 en A(t) = C₁ · e^(-k·t):",
            f"  A(0) = C₁ · e^(-k·0) = C₁ · e⁰ = C₁ · 1 = C₁",
            "",
            f"  Como A(0) = {req.A1}:",
            f"  C₁ = {req.A1}",
            "",
            "Paso 4.2: Escribir la solución particular",
            f"  A(t) = {req.A1} · e^(-k·t)",
            "",
            "Paso 4.3: Usar el segundo dato para encontrar k",
            f"  En t = {req.t}: A({req.t}) = {req.A2}",
            "",
            f"  Sustituimos en la solución particular:",
            f"  {req.A2} = {req.A1} · e^(-k·{req.t})",
            "",
            "Paso 4.4: Despejar el término exponencial",
            f"  e^(-k·{req.t}) = {req.A2} / {req.A1}",
            f"  e^(-k·{req.t}) = {req.A2/req.A1:.6g}",
            "",
            "Paso 4.5: Aplicar logaritmo natural",
            f"  ln(e^(-k·{req.t})) = ln({req.A2/req.A1:.6g})",
            f"  -k · {req.t} = {float(sp.log(req.A2/req.A1)):.6g}",
            "",
            "Paso 4.6: Despejar k",
            f"  k = -{float(sp.log(req.A2/req.A1)):.6g} / {req.t}",
            f"  k = {k:.6g}",
            "",
            "Paso 4.7: Ecuación final del modelo",
            f"  Sustituyendo k = {k:.6g}:",
            f"  A(t) = {req.A1} · e^(-{k:.6g} · t)",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 5: Cálculo de la vida media (T₁/₂)",
        substeps=[
            "La vida media es el tiempo necesario para que la cantidad se reduzca a la mitad.",
            "  A(T₁/₂) = A₀ / 2",
            "",
            "Paso 5.1: Plantear la ecuación",
            f"  {req.A1} · e^(-k · T₁/₂) = {req.A1} / 2",
            "",
            "Paso 5.2: Simplificar",
            "  e^(-k · T₁/₂) = 1/2",
            "",
            "Paso 5.3: Aplicar logaritmo natural",
            "  ln(e^(-k · T₁/₂)) = ln(1/2)",
            "  -k · T₁/₂ = -ln(2)",
            "",
            "Paso 5.4: Despejar T₁/₂",
            "  T₁/₂ = ln(2) / k",
            "",
            f"Paso 5.5: Sustituir k = {k:.6g}",
            f"  T₁/₂ = ln(2) / {k:.6g}",
            f"  T₁/₂ = {half_life:.4f}",
            "",
            f"La vida media es de {half_life:.4f} horas.",
        ]
    ))

    return RadioactiveDecayResponse(
        k=round(k, 6),
        half_life=round(half_life, 4),
        solution=f"A(t) = {req.A1} · e^(-{k:.6g} · t)",
        steps=steps,
    )


@router.post("/c14-dating", response_model=C14DatingResponse)
def c14_dating(req: C14DatingRequest):
    if req.N0 <= 0 or req.N <= 0:
        raise HTTPException(status_code=400, detail="N₀ y N deben ser positivos")
    if req.N >= req.N0:
        raise HTTPException(status_code=400, detail="N debe ser menor que N₀ (la cantidad disminuye con el tiempo)")

    def ratio_fraction(num: float, den: float) -> str | None:
        from math import gcd
        n, d = round(num), round(den)
        if d == 0 or n == 0:
            return None
        g = gcd(n, d)
        nn, dd = n // g, d // g
        return f"{nn}/{dd}" if dd > 1 else None

    HALF_LIFE_C14 = 5730.0
    k = float(sp.log(2) / HALF_LIFE_C14)
    ratio = req.N / req.N0
    frac = ratio_fraction(req.N, req.N0)
    steps: list[StepDetail] = []

    n_half = round(float(sp.log(req.N0 / req.N) / sp.log(2)))
    is_power_of_half = abs((0.5) ** n_half - ratio) < 1e-9

    steps.append(StepDetail(
        title="Paso 1: Identificación del problema y planteamiento",
        substeps=[
            "Modelo: Datación por Carbono-14",
            "",
            "Datos proporcionados:",
            f"  • N₀ = {req.N0}% (concentración inicial de ¹⁴C)",
            f"  • N = {req.N}% (concentración actual de ¹⁴C en la muestra)",
            "",
            *([f"Convertimos el porcentaje a fraccionario:",
              f"  {req.N}% = {frac}"] if frac else []),
            "",
            "Ecuación del modelo:",
            "  dN/dt = -k·N",
            "  N = N₀ · (1/2)^(t/5730)",
        ]
    ))

    if is_power_of_half and frac:
        steps.append(StepDetail(
            title="Paso 2: Sustituir los valores conocidos",
            substeps=[
                f"  N = N₀ · (1/2)^(t/5730)",
                "",
                f"Sustituimos N = N₀ · {frac}:",
                f"  N₀ · {frac} = N₀ · (1/2)^(t/5730)",
                "",
                "Cancelamos N₀ en ambos lados:",
                f"  {frac} = (1/2)^(t/5730)",
            ]
        ))

        steps.append(StepDetail(
            title="Paso 3: Igualar exponentes",
            substeps=[
                f"  {frac} = (1/2)^(t/5730)",
                "",
                f"Expresamos {frac} como potencia de 1/2:",
                f"  (1/2)^{n_half} = (1/2)^(t/5730)",
                "",
                "Igualamos exponentes:",
                f"  {n_half} = t / 5730",
            ]
        ))

        steps.append(StepDetail(
            title="Paso 4: Despejar t",
            substeps=[
                f"  t / 5730 = {n_half}",
                f"  t = {n_half} · 5730",
                f"  t = {n_half * 5730} años",
            ]
        ))

        age = n_half * 5730.0
    else:
        age = float(-sp.log(req.N / req.N0) / k)
        steps.append(StepDetail(
            title="Paso 2: Sustituir los valores conocidos",
            substeps=[
                f"  N = {req.N0} · (1/2)^(t/5730)",
                "",
                f"Sustituimos N = {req.N} y N₀ = {req.N0}:",
                f"  {req.N} = {req.N0} · (1/2)^(t/5730)",
                "",
                "Dividimos ambos lados por N₀:",
                f"  {frac if frac else f'{ratio:.4g}'} = (1/2)^(t/5730)",
            ]
        ))

        steps.append(StepDetail(
            title="Paso 3: Aplicar logaritmo para despejar t",
            substeps=[
                f"  ln({frac if frac else f'{ratio:.4g}'}) = ln((1/2)^(t/5730))",
                "",
                "Aplicamos propiedad del logaritmo:",
                f"  ln({frac if frac else f'{ratio:.4g}'}) = (t/5730) · ln(1/2)",
                f"  ln({frac if frac else f'{ratio:.4g}'}) = (t/5730) · (-ln|2|)",
                "",
                "Despejamos t:",
                f"  t = -5730 · ln({frac if frac else f'{ratio:.4g}'}) / ln|2|",
                f"  t = {age:.2f} años",
            ]
        ))

    return C14DatingResponse(
        k=round(k, 8),
        age=round(age, 2),
        solution=f"N = {req.N0} · (1/2)^(t/5730)",
        steps=steps,
    )


@router.post("/newton-cooling", response_model=NewtonCoolingResponse)
def newton_cooling(req: NewtonCoolingRequest):
    if req.T0 == req.Tm:
        raise HTTPException(status_code=400, detail="La temperatura inicial no puede ser igual a la ambiente")
    if req.t <= 0:
        raise HTTPException(status_code=400, detail="El tiempo debe ser positivo")

    k_sym = sp.symbols("k")
    eq = sp.Eq(req.Tm + (req.T0 - req.Tm) * sp.exp(k_sym * req.t), req.T)
    k = float(sp.solve(eq, k_sym)[0])
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
            "  dT/dt = k·(T - Tₘ)",
            "",
            "Donde:",
            "  • dT/dt = tasa de cambio de la temperatura",
            "  • T = temperatura en el tiempo t",
            "  • Tₘ = temperatura ambiente",
            "  • k = constante de proporcionalidad",
            f"  • Si T₀ > Tₘ, k será negativo (enfriamiento)",
            f"  • Si T₀ < Tₘ, k será positivo (calentamiento)",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 2: Clasificación de la ecuación diferencial",
        substeps=[
            "La ecuación dT/dt = k·(T - Tₘ) es una Ecuación Diferencial Ordinaria (EDO).",
            "",
            "Clasificación:",
            "  • Orden: 1er orden",
            "  • Grado: 1",
            "  • Lineal: Sí",
            "  • Separable: Sí",
            "  • Homogénea: No (por el término -k·Tₘ)",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 3: Resolución por variables separables",
        substeps=[
            "Para resolver dT/dt = k·(T - Tₘ), separamos las variables:",
            "",
            "Paso 3.1: Escribir en forma diferencial",
            "  dT/dt = k·(T - Tₘ)",
            "",
            "Paso 3.2: Separar variables T y t",
            "  Multiplicamos por dt y dividimos por (T - Tₘ):",
            "  dT/(T - Tₘ) = k·dt",
            "",
            "Paso 3.3: Integrar ambos lados",
            "  ∫ dT/(T - Tₘ) = ∫ k·dt",
            "",
            "Paso 3.4: Aplicar la integral",
            "  ln|T - Tₘ| = k·t + C",
            "  Donde C es la constante de integración.",
            "",
            "Paso 3.5: Despejar (T - Tₘ) aplicando exponencial",
            "  e^(ln|T - Tₘ|) = e^(k·t + C)",
            "  |T - Tₘ| = e^C · e^(k·t)",
            "",
            "Paso 3.6: Simplificar",
            "  T - Tₘ = C₁ · e^(k·t)",
            "  T(t) = Tₘ + C₁ · e^(k·t)",
            "  Donde C₁ = ±e^C es una constante.",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 4: Determinar la función T(t) y calcular k",
        substeps=[
            "Paso 4.1: Usar la condición inicial para encontrar C₁",
            "  En t = 0: T(0) = T₀",
            "",
            f"  Sustituimos t = 0 en T(t) = {req.Tm} + C₁ · e^(k·t):",
            f"  T(0) = {req.Tm} + C₁ · e^(k·0) = {req.Tm} + C₁ · e⁰ = {req.Tm} + C₁",
            "",
            f"  Como T(0) = {req.T0}:",
            f"  {req.Tm} + C₁ = {req.T0}",
            f"  C₁ = {req.T0} - {req.Tm} = {req.T0 - req.Tm}",
            "",
            "Paso 4.2: Escribir la solución particular",
            f"  T(t) = {req.Tm} + ({req.T0 - req.Tm}) · e^(k·t)",
            "",
            "Paso 4.3: Usar el segundo dato para encontrar k",
            f"  En t = {req.t}: T({req.t}) = {req.T}",
            "",
            f"  Sustituimos en la solución particular:",
            f"  {req.T} = {req.Tm} + ({req.T0 - req.Tm}) · e^(k·{req.t})",
            "",
            "Paso 4.4: Despejar el término exponencial",
            f"  ({req.T0 - req.Tm}) · e^(k·{req.t}) = {req.T} - {req.Tm}",
            f"  e^(k·{req.t}) = ({req.T} - {req.Tm}) / ({req.T0} - {req.Tm})",
            f"  e^(k·{req.t}) = {(req.T - req.Tm)/(req.T0 - req.Tm):.6g}",
            "",
            "Paso 4.5: Aplicar logaritmo natural",
            f"  ln(e^(k·{req.t})) = ln({(req.T - req.Tm)/(req.T0 - req.Tm):.6g})",
            f"  k · {req.t} = {float(sp.log((req.T - req.Tm)/(req.T0 - req.Tm))):.6g}",
            "",
            "Paso 4.6: Despejar k",
            f"  k = {float(sp.log((req.T - req.Tm)/(req.T0 - req.Tm))):.6g} / {req.t}",
            f"  k = {k:.6g}",
            "",
            "Paso 4.7: Ecuación final del modelo",
            f"  Sustituyendo k = {k:.6g}:",
            f"  T(t) = {req.Tm} + ({req.T0 - req.Tm}) · e^({k:.6g} · t)",
        ]
    ))

    return NewtonCoolingResponse(
        k=round(k, 6),
        solution=f"T(t) = {req.Tm} + ({req.T0 - req.Tm}) · e^({k:.6g} · t)",
        steps=steps,
    )
