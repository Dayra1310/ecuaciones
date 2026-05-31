import sympy as sp
import numpy as np
from app.models.schemas import StepDetail


def solve_exact(M, N, x, y):
    steps: list[StepDetail] = []
    M_expr = sp.sympify(M)
    N_expr = sp.sympify(N)

    steps.append(StepDetail(
        title="Paso 1: Identificación de las funciones M y N",
        substeps=[
            "La ecuación diferencial exacta tiene la forma: M(x,y) dx + N(x,y) dy = 0",
            f"Identificamos M(x,y) = {M}",
            f"Identificamos N(x,y) = {N}",
            "",
            "Una EDO es exacta si se cumple la condición de exactitud:",
            "  ∂M/∂y = ∂N/∂x",
            "",
            "Donde:",
            "  • ∂M/∂y = derivada parcial de M respecto a y",
            "  • ∂N/∂x = derivada parcial de N respecto a x",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 2: Verificación de la condición de exactitud",
        substeps=[
            "Paso 2.1: Calcular la derivada parcial de M respecto a y",
            f"  M(x,y) = {M_expr}",
            f"  ∂M/∂y = ∂/∂y [{M_expr}]",
        ]
    ))

    M_y = sp.diff(M_expr, y)
    steps[-1].substeps.append(f"  ∂M/∂y = {M_y}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 2.2: Calcular la derivada parcial de N respecto a x")
    steps[-1].substeps.append(f"  N(x,y) = {N_expr}")
    steps[-1].substeps.append(f"  ∂N/∂x = ∂/∂x [{N_expr}]")

    N_x = sp.diff(N_expr, x)
    steps[-1].substeps.append(f"  ∂N/∂x = {N_x}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 2.3: Comparar las derivadas parciales")
    steps[-1].substeps.append(f"  ∂M/∂y = {M_y}")
    steps[-1].substeps.append(f"  ∂N/∂x = {N_x}")

    if sp.simplify(M_y - N_x) == 0:
        steps[-1].substeps.append("")
        steps[-1].substeps.append("  Como ∂M/∂y = ∂N/∂x, la ecuación ES EXACTA. ✓")
    else:
        steps[-1].substeps.append("")
        steps[-1].substeps.append("  Como ∂M/∂y ≠ ∂N/∂x, la ecuación NO ES EXACTA.")

    steps.append(StepDetail(
        title="Paso 3: Integración de M respecto a x",
        substeps=[
            "Para una EDO exacta, existe una función F(x,y) tal que:",
            "  ∂F/∂x = M(x,y)  y  ∂F/∂y = N(x,y)",
            "",
            "Paso 3.1: Integrar M respecto a x (tratando y como constante)",
            f"  F(x,y) = ∫ M(x,y) dx + g(y) = ∫ ({M}) dx + g(y)",
        ]
    ))

    F_x = sp.integrate(M_expr, x)
    steps[-1].substeps.append(f"  F(x,y) = {F_x} + g(y)")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Donde:")
    steps[-1].substeps.append("  • F(x,y) es la función potencial que buscamos")
    steps[-1].substeps.append("  • g(y) es una función arbitraria de y (constante de integración)")

    steps.append(StepDetail(
        title="Paso 4: Derivación de F respecto a y y comparación con N",
        substeps=[
            "Paso 4.1: Derivar F respecto a y (tratando x como constante)",
            f"  F(x,y) = {F_x} + g(y)",
            f"  ∂F/∂y = ∂/∂y [{F_x}] + g'(y)",
        ]
    ))

    F_x_diff_y = sp.diff(F_x, y)
    steps[-1].substeps.append(f"  ∂F/∂y = {F_x_diff_y} + g'(y)")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 4.2: Igualar a N(x,y)")
    steps[-1].substeps.append("  Por definición de EDO exacta: ∂F/∂y = N(x,y)")
    steps[-1].substeps.append(f"  {F_x_diff_y} + g'(y) = {N_expr}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 4.3: Despejar g'(y)")
    steps[-1].substeps.append(f"  g'(y) = N(x,y) - ∂F/∂y")
    steps[-1].substeps.append(f"  g'(y) = ({N_expr}) - ({F_x_diff_y})")

    g_y_prime = sp.simplify(N_expr - F_x_diff_y)
    steps[-1].substeps.append(f"  g'(y) = {g_y_prime}")

    steps.append(StepDetail(
        title="Paso 5: Integración para encontrar g(y)",
        substeps=[
            "Paso 5.1: Integrar g'(y) respecto a y",
            f"  g(y) = ∫ g'(y) dy = ∫ ({g_y_prime}) dy",
        ]
    ))

    g_y = sp.integrate(N_expr - F_x_diff_y, y)
    steps[-1].substeps.append(f"  g(y) = {g_y}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Nota: La constante de integración se absorberá en la constante C final.")

    steps.append(StepDetail(
        title="Paso 6: Construcción de la función potencial F(x,y)",
        substeps=[
            "Paso 6.1: Sustituir g(y) en F(x,y)",
            f"  F(x,y) = [{F_x}] + [{g_y}]",
        ]
    ))

    F = sp.simplify(F_x + g_y)
    steps[-1].substeps.append(f"  F(x,y) = {F}")

    steps.append(StepDetail(
        title="Paso 7: Solución general de la ecuación",
        substeps=[
            "La solución general de una EDO exacta está dada por:",
            "  F(x,y) = C",
            "",
            "Donde C es una constante arbitraria.",
            "",
            f"Sustituyendo F(x,y) = {F}:",
            f"  Solución general: {F} = C",
            "",
            "Esta es una relación implícita entre x e y que satisface la ecuación diferencial.",
        ]
    ))

    return F, steps


def solve_not_exact(M, N, x, y):
    steps: list[StepDetail] = []
    M_expr = sp.sympify(M)
    N_expr = sp.sympify(N)

    steps.append(StepDetail(
        title="Paso 1: Identificación de las funciones M y N",
        substeps=[
            "La ecuación diferencial tiene la forma: M(x,y) dx + N(x,y) dy = 0",
            f"Identificamos M(x,y) = {M}",
            f"Identificamos N(x,y) = {N}",
            "",
            "Para determinar si necesitamos un factor integrante, verificamos la exactitud.",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 2: Cálculo de las derivadas parciales",
        substeps=[
            "Paso 2.1: Calcular ∂M/∂y",
            f"  ∂M/∂y = ∂/∂y ({M_expr})",
        ]
    ))

    M_y = sp.diff(M_expr, y)
    steps[-1].substeps.append(f"  ∂M/∂y = {M_y}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 2.2: Calcular ∂N/∂x")
    steps[-1].substeps.append(f"  ∂N/∂x = ∂/∂x ({N_expr})")

    N_x = sp.diff(N_expr, x)
    steps[-1].substeps.append(f"  ∂N/∂x = {N_x}")

    steps.append(StepDetail(
        title="Paso 3: Verificación de la condición de exactitud",
        substeps=[
            "Calculamos la diferencia entre las derivadas parciales:",
            f"  ∂M/∂y - ∂N/∂x = {M_y} - {N_x}",
        ]
    ))

    diff = M_y - N_x
    steps[-1].substeps.append(f"  ∂M/∂y - ∂N/∂x = {diff}")
    steps[-1].substeps.append("")

    if sp.simplify(diff) != 0:
        steps[-1].substeps.append("Como ∂M/∂y - ∂N/∂x ≠ 0, la ecuación NO ES EXACTA.")
        steps[-1].substeps.append("")
        steps[-1].substeps.append("Necesitamos encontrar un FACTOR INTEGRANTE μ(x,y) tal que:")
        steps[-1].substeps.append("  μ·M dx + μ·N dy = 0  sea una ecuación exacta.")
        steps[-1].substeps.append("")
        steps[-1].substeps.append("Esto requiere:")
        steps[-1].substeps.append("  ∂(μ·M)/∂y = ∂(μ·N)/∂x")
    else:
        steps[-1].substeps.append("La ecuación es exacta. No se necesita factor integrante.")

    factor = None
    method = ""

    steps.append(StepDetail(
        title="Paso 4: Búsqueda de factor integrante que depende solo de x",
        substeps=[
            "Probamos primero si existe un factor integrante de la forma μ = μ(x).",
            "",
            "Criterio: Si (∂M/∂y - ∂N/∂x) / N es función solo de x, entonces:",
            "  μ(x) = e^∫ [(∂M/∂y - ∂N/∂x)/N] dx",
            "",
            "Paso 4.1: Calcular la expresión",
            f"  (∂M/∂y - ∂N/∂x)/N = ({diff}) / ({N_expr})",
        ]
    ))

    expr1 = sp.simplify(diff / N_expr)
    steps[-1].substeps.append(f"  = {expr1}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 4.2: Verificar si la expresión depende solo de x")
    steps[-1].substeps.append(f"  ¿La expresión {expr1} contiene la variable y?")

    expr1_simplified = sp.simplify(expr1)
    if not expr1_simplified.has(y):
        steps[-1].substeps.append(f"  No, {expr1_simplified} no contiene y.")
        steps[-1].substeps.append("")
        steps[-1].substeps.append("Paso 4.3: Calcular el factor integrante μ(x)")
        steps[-1].substeps.append(f"  μ(x) = e^∫ ({expr1_simplified}) dx")

        mu = sp.exp(sp.integrate(expr1_simplified, x))
        factor = sp.simplify(mu)
        method = "factor_integrante_x"

        steps[-1].substeps.append(f"  μ(x) = {factor}")
    else:
        steps[-1].substeps.append(f"  Sí, {expr1_simplified} contiene y.")
        steps[-1].substeps.append("")
        steps[-1].substeps.append("No existe factor integrante que dependa solo de x.")
        steps[-1].substeps.append("Intentamos con factor integrante que dependa solo de y.")

    if factor is None:
        steps.append(StepDetail(
            title="Paso 5: Búsqueda de factor integrante que depende solo de y",
            substeps=[
                "Probamos ahora si existe un factor integrante de la forma μ = μ(y).",
                "",
                "Criterio: Si -(∂M/∂y - ∂N/∂x) / M es función solo de y, entonces:",
                "  μ(y) = e^∫ [-(∂M/∂y - ∂N/∂x)/M] dy",
                "",
                "Paso 5.1: Calcular la expresión",
                f"  -(∂M/∂y - ∂N/∂x)/M = -({diff}) / ({M_expr})",
            ]
        ))

        expr2 = sp.simplify(-diff / M_expr)
        steps[-1].substeps.append(f"  = {expr2}")
        steps[-1].substeps.append("")
        steps[-1].substeps.append("Paso 5.2: Verificar si la expresión depende solo de y")
        steps[-1].substeps.append(f"  ¿La expresión {expr2} contiene la variable x?")

        if not expr2.has(x):
            steps[-1].substeps.append(f"  No, {expr2} no contiene x.")
            steps[-1].substeps.append("")
            steps[-1].substeps.append("Paso 5.3: Calcular el factor integrante μ(y)")
            steps[-1].substeps.append(f"  μ(y) = e^∫ ({expr2}) dy")

            mu = sp.exp(sp.integrate(expr2, y))
            factor = sp.simplify(mu)
            method = "factor_integrante_y"

            steps[-1].substeps.append(f"  μ(y) = {factor}")
        else:
            steps[-1].substeps.append(f"  Sí, {expr2} contiene x.")
            steps[-1].substeps.append("")
            steps[-1].substeps.append("No existe factor integrante que dependa solo de y.")
            steps[-1].substeps.append("")
            steps[-1].substeps.append("No se encontró un factor integrante simple.")
            steps[-1].substeps.append("La ecuación podría requerir métodos más avanzados.")
            return None, factor, steps, method

    steps.append(StepDetail(
        title="Paso 6: Multiplicar la ecuación por el factor integrante",
        substeps=[
            f"Multiplicamos M y N por μ = {factor}:",
            "",
            "Paso 6.1: Calcular M' = μ·M",
            f"  M' = ({factor}) · ({M_expr})",
        ]
    ))

    M_new = sp.simplify(factor * M_expr)
    steps[-1].substeps.append(f"  M' = {M_new}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 6.2: Calcular N' = μ·N")
    steps[-1].substeps.append(f"  N' = ({factor}) · ({N_expr})")

    N_new = sp.simplify(factor * N_expr)
    steps[-1].substeps.append(f"  N' = {N_new}")

    steps.append(StepDetail(
        title="Paso 7: Verificación de que la nueva ecuación es exacta",
        substeps=[
            "Verificamos que la ecuación M' dx + N' dy = 0 sea exacta:",
            "",
            "Paso 7.1: Calcular ∂M'/∂y",
            f"  ∂M'/∂y = ∂/∂y ({M_new})",
        ]
    ))

    M_new_y = sp.diff(M_new, y)
    steps[-1].substeps.append(f"  ∂M'/∂y = {M_new_y}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 7.2: Calcular ∂N'/∂x")
    steps[-1].substeps.append(f"  ∂N'/∂x = ∂/∂x ({N_new})")

    N_new_x = sp.diff(N_new, x)
    steps[-1].substeps.append(f"  ∂N'/∂x = {N_new_x}")
    steps[-1].substeps.append("")

    if sp.simplify(M_new_y - N_new_x) == 0:
        steps[-1].substeps.append("Como ∂M'/∂y = ∂N'/∂x, la ecuación AHORA ES EXACTA. ✓")
    else:
        steps[-1].substeps.append("Advertencia: La ecuación aún no parece exacta.")

    steps.append(StepDetail(
        title="Paso 8: Integración de M' respecto a x",
        substeps=[
            "Ahora resolvemos la ecuación exacta M' dx + N' dy = 0",
            "",
            "Buscamos F(x,y) tal que:",
            "  ∂F/∂x = M'  y  ∂F/∂y = N'",
            "",
            "Paso 8.1: Integrar M' respecto a x",
            f"  F(x,y) = ∫ M' dx + g(y) = ∫ ({M_new}) dx + g(y)",
        ]
    ))

    F_x = sp.integrate(M_new, x)
    steps[-1].substeps.append(f"  F(x,y) = {F_x} + g(y)")

    steps.append(StepDetail(
        title="Paso 9: Derivación y comparación con N'",
        substeps=[
            "Paso 9.1: Derivar F respecto a y",
            f"  F(x,y) = {F_x} + g(y)",
            f"  ∂F/∂y = ∂/∂y [{F_x}] + g'(y)",
        ]
    ))

    F_x_diff_y = sp.diff(F_x, y)
    steps[-1].substeps.append(f"  ∂F/∂y = {F_x_diff_y} + g'(y)")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 9.2: Igualar a N'")
    steps[-1].substeps.append(f"  {F_x_diff_y} + g'(y) = {N_new}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 9.3: Despejar g'(y)")

    g_y_prime = sp.simplify(N_new - F_x_diff_y)
    steps[-1].substeps.append(f"  g'(y) = {g_y_prime}")

    steps.append(StepDetail(
        title="Paso 10: Integración para encontrar g(y)",
        substeps=[
            "Paso 10.1: Integrar g'(y) respecto a y",
            f"  g(y) = ∫ g'(y) dy = ∫ ({g_y_prime}) dy",
        ]
    ))

    g_y = sp.integrate(N_new - F_x_diff_y, y)
    steps[-1].substeps.append(f"  g(y) = {g_y}")

    steps.append(StepDetail(
        title="Paso 11: Construcción de la solución",
        substeps=[
            "Paso 11.1: Construir F(x,y)",
            f"  F(x,y) = [{F_x}] + [{g_y}]",
        ]
    ))

    F = sp.simplify(F_x + g_y)
    steps[-1].substeps.append(f"  F(x,y) = {F}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 11.2: Solución general")
    steps[-1].substeps.append("  F(x,y) = C")
    steps[-1].substeps.append(f"  Solución: {F} = C")

    return F, factor, steps, method


def solve_differential_equation(M: str, N: str, variable: str = "x"):
    steps: list[StepDetail] = []
    x, y = sp.symbols(f"{variable} y")

    M_expr = sp.sympify(M)
    N_expr = sp.sympify(N)

    steps.append(StepDetail(
        title="Paso 0: Planteamiento de la ecuación",
        substeps=[
            "La ecuación diferencial se presenta en la forma:",
            "  M(x,y) dx + N(x,y) dy = 0",
            "",
            f"  M(x,y) = {M_expr}",
            f"  N(x,y) = {N_expr}",
            "",
            "Donde:",
            "  • M(x,y) es el coeficiente de dx",
            "  • N(x,y) es el coeficiente de dy",
            "  • x es la variable independiente",
            "  • y es la variable dependiente",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 0.1: Clasificación de la ecuación diferencial",
        substeps=[
            "Clasificación de la EDO:",
            "  • Orden: 1er orden (solo aparece la primera derivada)",
            "  • Forma: Diferencial (M dx + N dy = 0)",
            "",
            "Para determinar si es exacta, verificamos:",
            "  Si ∂M/∂y = ∂N/∂x → La ecuación es exacta",
            "  Si ∂M/∂y ≠ ∂N/∂x → La ecuación no es exacta (buscamos factor integrante)",
        ]
    ))

    steps.append(StepDetail(
        title="Paso 0.2: Cálculo de derivadas parciales para verificación",
        substeps=[
            "Paso 0.2.1: Calcular ∂M/∂y",
            f"  M(x,y) = {M_expr}",
            f"  ∂M/∂y = ∂/∂y ({M_expr})",
        ]
    ))

    M_y = sp.diff(M_expr, y)
    steps[-1].substeps.append(f"  ∂M/∂y = {M_y}")
    steps[-1].substeps.append("")
    steps[-1].substeps.append("Paso 0.2.2: Calcular ∂N/∂x")
    steps[-1].substeps.append(f"  N(x,y) = {N_expr}")
    steps[-1].substeps.append(f"  ∂N/∂x = ∂/∂x ({N_expr})")

    N_x = sp.diff(N_expr, x)
    steps[-1].substeps.append(f"  ∂N/∂x = {N_x}")

    if sp.simplify(M_y - N_x) == 0:
        steps.append(StepDetail(
            title="Paso 0.3: Conclusión - La ecuación es exacta",
            substeps=[
                "Resultado de la verificación:",
                f"  ∂M/∂y = {M_y}",
                f"  ∂N/∂x = {N_x}",
                "",
                "  ∂M/∂y = ∂N/∂x ✓",
                "",
                "La ecuación ES EXACTA.",
                "",
                "Esto significa que existe una función F(x,y) tal que:",
                "  ∂F/∂x = M(x,y)",
                "  ∂F/∂y = N(x,y)",
                "",
                "Procedemos a resolver usando el método para ecuaciones exactas.",
            ]
        ))

        F, solve_steps = solve_exact(M, N, x, y)
        steps.extend(solve_steps)

        return {
            "exact": True,
            "solution": str(F) + " = C",
            "integrating_factor": None,
            "method": "exacta",
            "steps": steps,
        }
    else:
        steps.append(StepDetail(
            title="Paso 0.3: Conclusión - La ecuación no es exacta",
            substeps=[
                "Resultado de la verificación:",
                f"  ∂M/∂y = {M_y}",
                f"  ∂N/∂x = {N_x}",
                "",
                "  ∂M/∂y ≠ ∂N/∂x",
                "",
                "La ecuación NO ES EXACTA.",
                "",
                "Esto significa que necesitamos encontrar un FACTOR INTEGRANTE μ(x,y)",
                "tal que al multiplicar la ecuación por μ, esta se convierta en exacta.",
                "",
                "Buscamos un factor integrante de la forma:",
                "  • μ = μ(x) (solo depende de x)",
                "  • μ = μ(y) (solo depende de y)",
            ]
        ))

        F, factor, solve_steps, method = solve_not_exact(M, N, x, y)
        if F is None:
            return {
                "exact": False,
                "solution": None,
                "integrating_factor": None,
                "method": "no_encontrado",
                "steps": steps,
            }
        steps.extend(solve_steps)
        return {
            "exact": False,
            "solution": str(F) + " = C",
            "integrating_factor": str(factor),
            "method": method,
            "steps": steps,
        }
