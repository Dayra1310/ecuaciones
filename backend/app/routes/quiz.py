from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    QuizExerciseParams,
    Quiz1Request,
    Quiz1Response,
    Quiz1ResultItem,
    Quiz2Blank,
    Quiz2Response,
)
import sympy as sp
import math

router = APIRouter(prefix="/quiz", tags=["Quiz"])


def _real_solution(solutions: list) -> float:
    for sol in solutions:
        if sol.is_real:
            return float(sol)
    return float(solutions[0])


def _fmt(n: float) -> str:
    if abs(n) < 0.0001:
        s = f"{n:.4e}"
        parts = s.split("e")
        exp = parts[1]
        if exp.startswith("-0"):
            exp = "-" + exp[2:]
        elif exp.startswith("0"):
            exp = exp[1:]
        return f"{parts[0]}e{exp}"
    return f"{n:.5f}"


def _compute_crecimiento(P0: float, P: float, t: float, t2: float) -> tuple[float, float]:
    t_sym, k = sp.symbols("t k")
    P_func = sp.Function("P")
    ode = sp.Eq(sp.Derivative(P_func(t_sym), t_sym), k * P_func(t_sym))
    particular = sp.dsolve(ode, P_func(t_sym), ics={P_func(0): P0})
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t_sym, t), P), k))
    proy = float(particular.rhs.subs({k: k_val, t_sym: t2}))
    return k_val, proy


def _compute_decaimiento(A1: float, A2: float, t: float, t2: float) -> tuple[float, float]:
    t_sym, k = sp.symbols("t k")
    A = sp.Function("A")
    ode = sp.Eq(sp.Derivative(A(t_sym), t_sym), -k * A(t_sym))
    particular = sp.dsolve(ode, A(t_sym), ics={A(0): A1})
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t_sym, t), A2), k))
    proy = float(particular.rhs.subs({k: k_val, t_sym: t2}))
    return k_val, proy


def _compute_newton(Tm: float, T0: float, t: float, T: float, t2: float) -> tuple[float, float]:
    t_sym, k = sp.symbols("t k")
    T_func = sp.Function("T")
    Tm_sym = sp.symbols("Tm")
    ode = sp.Eq(sp.Derivative(T_func(t_sym), t_sym), k * (T_func(t_sym) - Tm_sym))
    particular = sp.dsolve(ode, T_func(t_sym), ics={T_func(0): T0}).subs(Tm_sym, Tm)
    k_val = _real_solution(sp.solve(sp.Eq(particular.rhs.subs(t_sym, t), T), k))
    proy = float(particular.rhs.subs({k: k_val, t_sym: t2}))
    return k_val, proy


def _compute_c14(N: float) -> tuple[float, float]:
    HALF_LIFE = 5730
    k_val = math.log(2) / HALF_LIFE
    t_sym, k = sp.symbols("t k")
    N_func = sp.Function("N")
    ode = sp.Eq(sp.Derivative(N_func(t_sym), t_sym), -k * N_func(t_sym))
    particular = sp.dsolve(ode, N_func(t_sym), ics={N_func(0): 100.0})
    particular_known = particular.subs(k, sp.log(2) / HALF_LIFE)
    age = _real_solution(sp.solve(sp.Eq(particular_known.rhs, N), t_sym))
    return k_val, age


@router.post("/evaluate-quiz1", response_model=Quiz1Response)
def evaluate_quiz1(req: Quiz1Request):
    resultados = []
    for ex in req.exercises:
        try:
            if ex.tipo == "crecimiento":
                if None in (ex.P0, ex.P, ex.t, ex.t2):
                    raise HTTPException(status_code=400, detail="Faltan parámetros para crecimiento")
                k, proy = _compute_crecimiento(ex.P0, ex.P, ex.t, ex.t2)
                resultados.append(Quiz1ResultItem(k=round(k, 6), valorProyectado=round(proy, 6)))
            elif ex.tipo == "decaimiento":
                if None in (ex.A1, ex.A2, ex.t, ex.t2):
                    raise HTTPException(status_code=400, detail="Faltan parámetros para decaimiento")
                k, proy = _compute_decaimiento(ex.A1, ex.A2, ex.t, ex.t2)
                resultados.append(Quiz1ResultItem(k=round(k, 6), valorProyectado=round(proy, 6)))
            elif ex.tipo == "newton":
                if None in (ex.Tm, ex.T0, ex.t, ex.T, ex.t2):
                    raise HTTPException(status_code=400, detail="Faltan parámetros para Newton")
                k, proy = _compute_newton(ex.Tm, ex.T0, ex.t, ex.T, ex.t2)
                resultados.append(Quiz1ResultItem(k=round(k, 6), valorProyectado=round(proy, 6)))
            elif ex.tipo == "c14":
                if ex.N is None:
                    raise HTTPException(status_code=400, detail="Falta N para C14")
                k, proy = _compute_c14(ex.N)
                resultados.append(Quiz1ResultItem(k=round(k, 8), valorProyectado=round(proy, 6)))
            else:
                raise HTTPException(status_code=400, detail=f"Tipo desconocido: {ex.tipo}")
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    return Quiz1Response(resultados=resultados)


@router.post("/evaluate-quiz2", response_model=Quiz2Response)
def evaluate_quiz2(req: QuizExerciseParams):
    blanks: list[Quiz2Blank] = []
    try:
        if req.tipo == "crecimiento":
            if None in (req.P0, req.P, req.t, req.t2):
                raise HTTPException(status_code=400, detail="Faltan parámetros para crecimiento")
            k, proy = _compute_crecimiento(req.P0, req.P, req.t, req.t2)
            blanks = [
                Quiz2Blank(id="k_val", respuesta=_fmt(k)),
                Quiz2Blank(id="k_aprox", respuesta=_fmt(k)),
                Quiz2Blank(id="proy_val", respuesta=round(proy, 6)),
                Quiz2Blank(id="C", respuesta=req.P0),
                Quiz2Blank(id="P0_sol", respuesta=req.P0),
            ]
        elif req.tipo == "decaimiento":
            if None in (req.A1, req.A2, req.t, req.t2):
                raise HTTPException(status_code=400, detail="Faltan parámetros para decaimiento")
            k, proy = _compute_decaimiento(req.A1, req.A2, req.t, req.t2)
            blanks = [
                Quiz2Blank(id="k_val", respuesta=_fmt(k)),
                Quiz2Blank(id="k_aprox", respuesta=_fmt(k)),
                Quiz2Blank(id="proy_val", respuesta=round(proy, 6)),
                Quiz2Blank(id="C", respuesta=req.A1),
                Quiz2Blank(id="A1_sol", respuesta=req.A1),
            ]
        elif req.tipo == "c14":
            if req.N is None:
                raise HTTPException(status_code=400, detail="Falta N para C14")
            k, age = _compute_c14(req.N)
            blanks = [
                Quiz2Blank(id="k_val", respuesta=_fmt(k)),
                Quiz2Blank(id="k_aprox", respuesta=_fmt(k)),
                Quiz2Blank(id="N_act", respuesta=req.N),
                Quiz2Blank(id="edad", respuesta=round(age, 6)),
            ]
        elif req.tipo == "newton":
            if None in (req.Tm, req.T0, req.t, req.T, req.t2):
                raise HTTPException(status_code=400, detail="Faltan parámetros para Newton")
            k, proy = _compute_newton(req.Tm, req.T0, req.t, req.T, req.t2)
            blanks = [
                Quiz2Blank(id="k_val", respuesta=_fmt(k)),
                Quiz2Blank(id="k_aprox", respuesta=_fmt(k)),
                Quiz2Blank(id="proy_val", respuesta=round(proy, 6)),
                Quiz2Blank(id="C_val", respuesta=round(req.T0 - req.Tm, 6)),
                Quiz2Blank(id="C_sol", respuesta=round(req.T0 - req.Tm, 6)),
                Quiz2Blank(id="Tm_sol", respuesta=req.Tm),
            ]
        else:
            raise HTTPException(status_code=400, detail=f"Tipo desconocido: {req.tipo}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    return Quiz2Response(blanks=blanks)
