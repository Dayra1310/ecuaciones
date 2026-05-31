import { useState } from "react";

type ModeloId = "crecimiento" | "decaimiento" | "c14" | "newton" | "ods";

interface Paso {
  codigo: string;
  explicacion: string;
}

interface ModeloInfo {
  id: ModeloId;
  titulo: string;
  icono: string;
  intro: string;
  pasos: Paso[];
}

const modelos: ModeloInfo[] = [
  {
    id: "crecimiento",
    titulo: "Crecimiento proporcional",
    icono: "📈",
    intro: "La función `population_growth` en `routes/equations.py` recibe los datos del formulario, calcula k y construye los pasos de solución.",
    pasos: [
      {
        codigo: 'k = log(req.P / req.P0) / req.t',
        explicacion: "k se calcula despejando de P(t) = P₀·e^(k·t). Usando el dato conocido P(t) = P, se tiene k = ln(P/P₀)/t. El módulo math.log() realiza el cálculo numérico y el resultado se almacena como float. 🔷 **SymPy haría esto con `sp.log()`** manteniendo k como símbolo en lugar de número.",
      },
      {
        codigo: `steps: list[StepDetail] = []`,
        explicacion: "Se inicializa una lista vacía de pasos. Cada paso es un objeto StepDetail con un título y una lista de substeps (strings). El frontend recibe esta lista y la renderiza como una secuencia numerada. 🔷 **SymPy no participa en la construcción de pasos**, esto es lógica de presentación del backend.",
      },
      {
        codigo: `steps.append(StepDetail(
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
        ...
    ]
))`,
        explicacion: "Cada paso se construye con un título descriptivo y una lista de strings que el frontend muestra como texto plano. Los f-strings insertan los valores numéricos del request. Las líneas vacías separan párrafos. Los espacios dobles simulan sangría. 🔷 **SymPy modelaría la EDO como `sp.Eq(sp.Derivative(P(t), t), k*P(t))`** en lugar de escribirla como string.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 2: Clasificación de la ecuación diferencial",
    substeps=[
        "Clasificación:",
        "  • Orden: 1er orden",
        "  • Lineal: Sí",
        "  • Separable: Sí",
        "  • Homogénea: Sí",
    ]
))`,
        explicacion: "Cada modelo tiene su clasificación fija: crecimiento es lineal, separable, homogénea, 1er orden. El backend escribe estos strings directamente en los substeps. 🔷 **SymPy clasificaría con `sp.classify_ode()`**, que devuelve automáticamente los tipos de EDO que reconoce.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 3: Resolución por variables separables",
    substeps=[
        "dP/P = k·dt",
        "∫ dP/P = ∫ k·dt",
        "ln|P| = k·t + C",
        "P(t) = C₁ · e^(k·t)",
        ...
    ]
))`,
        explicacion: "Los pasos de resolución manual están escritos como strings fijos que explican el método de variables separables: separar variables, integrar ambos lados, despejar la solución general. 🔷 **SymPy resolvería automáticamente con `sp.dsolve()`**, aplicando separación de variables internamente sin necesidad de escribir los pasos a mano.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 4: Determinar la función P(t) y calcular k",
    substeps=[
        f"P(0) = {req.P0}",
        f"C₁ = {req.P0}",
        f"P(t) = {req.P0} · e^(k·t)",
        f"k = {k:.6g}",
        f"P(t) = {req.P0} · e^({k:.6g} · t)",
        ...
    ]
))`,
        explicacion: "En el paso 4, los f-strings interpolan los valores reales: P₀, k, t. El formato :.6g usa 6 cifras significativas. La solución final se construye como string: 'P(t) = 500 · e^(0.15 · t)'. 🔷 **SymPy haría `sp.dsolve(edo, ics={P(0): P0})`** para aplicar condición inicial y obtener la solución particular simbólica.",
      },
      {
        codigo: `return PopulationGrowthResponse(
    k=round(k, 6),
    solution=f"P(t) = {req.P0} · e^({k:.6g} · t)",
    steps=steps,
)`,
        explicacion: "La respuesta es un Pydantic model con k (float redondeado a 6 decimales), la solución como string, y la lista de pasos. El frontend tipa estos campos con TypeScript y los renderiza en PopulationResult.",
      },
    ],
  },
  {
    id: "decaimiento",
    titulo: "Decaimiento radiactivo",
    icono: "☢️",
    intro: "La función `radioactive_decay` en `routes/equations.py` sigue el mismo patrón que crecimiento, pero con validaciones adicionales y el cálculo de vida media.",
    pasos: [
      {
        codigo: `if req.A2 >= req.A1:
    raise HTTPException(
        status_code=400,
        detail="A2 debe ser menor que A1"
    )`,
        explicacion: "Validación específica del decaimiento: la cantidad final debe ser menor que la inicial. Si no, la petición se rechaza con HTTP 400. Esto evita que k sea negativa o indefinida. 🔷 **SymPy haría esta validación simbólicamente** con `sp.solve(sp.Eq(A(t), A2), k)` para obtener k en términos de los símbolos.",
      },
      {
        codigo: `k = log(req.A1 / req.A2) / req.t`,
        explicacion: "La fórmula es k = ln(A₁/A₂)/t (sin signo negativo porque A₁ > A₂ hace el cociente > 1). El signo negativo de la EDO dA/dt = -k·A ya está implícito en el modelo. 🔷 **SymPy usaría `sp.log()`** para mantener k como expresión simbólica exacta, no un float.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 3: Resolución por variables separables",
    substeps=[
        "dA/A = -k·dt",
        "∫ dA/A = ∫ -k·dt",
        "ln|A| = -k·t + C",
        "A(t) = C₁ · e^(-k·t)",
    ]
))`,
        explicacion: "Los pasos de separación de variables incluyen el signo negativo en la integral. El string 'dA/A = -k·dt' se escribe literalmente en el código y se envía al frontend como parte de los substeps. 🔷 **SymPy integraría con `sp.integrate()`**: `∫ 1/A dA = ∫ -k dt` → `sp.log(A(t)) = -k*t + C`.",
      },
      {
        codigo: `half_life = log(2) / k

steps.append(StepDetail(
    title="Paso 5: Cálculo de la vida media (T₁/₂)",
    substeps=[
        "T₁/₂ = ln(2) / k",
        f"T₁/₂ = ln(2) / {k:.6g}",
        f"T₁/₂ = {half_life:.4f}",
    ]
))`,
        explicacion: "La vida media se calcula con T₁/₂ = ln(2)/k, también del módulo math. El paso 5 se agrega después de los 4 pasos estándar. half_life se formatea con 4 decimales y se incluye en la respuesta. 🔷 **SymPy haría `sp.solve(sp.Eq(A(t), A0/2), t)`** para despejar T₁/₂ simbólicamente como `sp.log(2)/k`.",
      },
      {
        codigo: `return RadioactiveDecayResponse(
    k=round(k, 6),
    half_life=round(half_life, 4),
    solution=f"A(t) = {req.A1} · e^(-{k:.6g} · t)",
    steps=steps,
)`,
        explicacion: "La respuesta del decaimiento incluye half_life adicionalmente. El frontend tipa esto en RadioactiveDecayResponse y DecayResult lo muestra. La solución se expresa con exponente negativo.",
      },
    ],
  },
  {
    id: "c14",
    titulo: "Carbono-14",
    icono: "🦴",
    intro: "La función `c14_dating` en `routes/equations.py` usa la vida media fija del ¹⁴C (5730 años) para calcular la edad de una muestra a partir del porcentaje restante.",
    pasos: [
      {
        codigo: `from math import log, gcd

def ratio_fraction(num: float, den: float) -> str | None:
    n, d = round(num), round(den)
    if d == 0 or n == 0:
        return None
    g = gcd(n, d)
    nn, dd = n // g, d // g
    return f"{nn}/{dd}" if dd > 1 else None`,
        explicacion: "Se define una función auxiliar `ratio_fraction()` que convierte la relación N/N₀ a una fracción simplificada usando `math.gcd()`. Por ejemplo, 25/100 → gcd(25,100)=25 → 1/4. Si no se puede simplificar (denominador=1), retorna None. 🔷 **SymPy haría `sp.nsimplify(ratio)`** para convertir automáticamente un float a su fracción racional más cercana.",
      },
      {
        codigo: `HALF_LIFE_C14 = 5730.0
k = log(2) / HALF_LIFE_C14`,
        explicacion: "La constante k se calcula directamente de la vida media: k = ln(2)/5730. No se necesita despejar de datos del usuario porque la vida media del ¹⁴C es un valor fijo y conocido. 🔷 **SymPy mantendría k como `sp.log(2)/5730`** en lugar de evaluarlo numéricamente, preservando la expresión simbólica exacta.",
      },
      {
        codigo: `n_half = round(log(req.N0 / req.N) / log(2))
is_power_of_half = abs((0.5) ** n_half - ratio) < 1e-9`,
        explicacion: "Se detecta si N/N₀ es una potencia exacta de 1/2 (como 1/2, 1/4, 1/8, etc.). Si lo es, se usa el método algebraico: igualar exponentes de (1/2)^n = (1/2)^(t/5730). Si no, se usan logaritmos. 🔷 **SymPy haría `sp.solve(sp.Eq(ratio, (sp.Rational(1,2))**(t/5730)), t)`** para resolver simbólicamente en ambos casos.",
      },
      {
        codigo: `# Rama algebraica (potencia exacta de 1/2):
steps.append(StepDetail(
    title="Paso 3: Igualar exponentes",
    substeps=[
        f"(1/2)^{n_half} = (1/2)^(t/5730)",
        f"{n_half} = t / 5730",
    ]
))
steps.append(StepDetail(
    title="Paso 4: Despejar t",
    substeps=[
        f"t / 5730 = {n_half}",
        f"t = {n_half} · 5730",
        f"t = {n_half * 5730} años",
    ]
))`,
        explicacion: "Cuando la fracción es potencia de 1/2 (ej. 1/4 = (1/2)²), se igualan exponentes directamente: 2 = t/5730 → t = 2·5730 = 11460 años. No se necesitan logaritmos. 🔷 **SymPy haría `sp.solve(sp.Eq(sp.Rational(1,4), (sp.Rational(1,2))**(t/5730)), t)`** → `t = 11460`.",
      },
      {
        codigo: `# Rama logarítmica (fracción no exacta):
steps.append(StepDetail(
    title="Paso 3: Aplicar logaritmo para despejar t",
    substeps=[
        f"ln({frac}) = ln((1/2)^(t/5730))",
        f"ln({frac}) = (t/5730) · ln(1/2)",
        f"ln({frac}) = (t/5730) · (-ln|2|)",
        f"t = -5730 · ln({frac}) / ln|2|",
        f"t = {age:.2f} años",
    ]
))`,
        explicacion: "Para fracciones que no son potencia exacta de 1/2 (ej. 30%, 42%), se aplica logaritmo natural. La propiedad ln(a^b)=b·ln(a) permite bajar el exponente. Se usa ln|2| en lugar de ln(2) por consistencia con la notación matemática. 🔷 **SymPy haría `sp.solve(sp.Eq(N, N0*(sp.Rational(1,2))**(t/5730)), t)`** para despejar t simbólicamente.",
      },
      {
        codigo: `return C14DatingResponse(
    k=round(k, 8),
    age=round(age, 2),
    solution=f"N = {req.N0} · (1/2)^(t/5730)",
    steps=steps,
)`,
        explicacion: "La respuesta incluye k (constante de decaimiento), age (edad calculada en años) y la ecuación del modelo. El frontend tipa estos campos como C14DatingResponse y C14Result los muestra. A diferencia del decaimiento general, aquí no se devuelve half_life porque ya es un dato conocido (5730).",
      },
    ],
  },
  {
    id: "newton",
    titulo: "Ley de Enfriamiento de Newton",
    icono: "🌡️",
    intro: "La función `newton_cooling` en `routes/equations.py` maneja tres parámetros (Tₘ, T₀, T) y usa una fórmula más compleja para k.",
    pasos: [
      {
        codigo: `if req.T0 == req.Tm:
    raise HTTPException(
        status_code=400,
        detail="Temperatura inicial no puede ser igual a la ambiente"
    )`,
        explicacion: "Validación: si T₀ = Tₘ no hay gradiente térmico y la ecuación se vuelve constante (dT/dt = 0). El logaritmo de cero no está definido, por eso se rechaza. 🔷 **SymPy modelaría la EDO como `sp.Eq(sp.Derivative(T(t), t), k*(T(t) - Tm))`** con `Tm` como símbolo.",
      },
      {
        codigo: `k = log((req.T - req.Tm) / (req.T0 - req.Tm)) / req.t`,
        explicacion: "k se despeja de T(t) = Tₘ + (T₀-Tₘ)·e^(k·t). Se aísla el término exponencial: (T-Tₘ)/(T₀-Tₘ) = e^(k·t) → k = ln((T-Tₘ)/(T₀-Tₘ))/t. Si T₀ > Tₘ y T está entre Tₘ y T₀, k será negativo (enfriamiento). 🔷 **SymPy despejaría k algebraicamente con `sp.solve()`**, manteniendo la relación simbólica exacta.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 2: Clasificación de la ecuación diferencial",
    substeps=[
        "Clasificación:",
        "  • Orden: 1er orden",
        "  • Lineal: Sí",
        "  • Separable: Sí",
        "  • Homogénea: No (por el término -k·Tₘ)",
    ]
))`,
        explicacion: "A diferencia de crecimiento/decaimiento, Newton se clasifica como NO homogénea debido al término constante -k·Tₘ. La clasificación se escribe directamente como string en los substeps. 🔷 **SymPy lo clasificaría con `sp.classify_ode()`** como 'separable', '1st_linear', 'Bernoulli', etc.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 3: Resolución por variables separables",
    substeps=[
        "dT/(T - Tₘ) = k·dt",
        "∫ dT/(T - Tₘ) = ∫ k·dt",
        "ln|T - Tₘ| = k·t + C",
        "T(t) = Tₘ + C₁ · e^(k·t)",
    ]
))`,
        explicacion: "La separación de variables requiere dividir por (T - Tₘ). La integral de dT/(T - Tₘ) da ln|T - Tₘ|. La solución general incluye Tₘ como constante aditiva. 🔷 **SymPy integraría con `sp.integrate()`**: `∫ 1/(T-Tₘ) dT = ∫ k dt` → `sp.log(T(t) - Tm) = k*t + C`.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 4: Determinar la función T(t) y calcular k",
    substeps=[
        f"C₁ = {req.T0} - {req.Tm} = {req.T0 - req.Tm}",
        f"T(t) = {req.Tm} + ({req.T0 - req.Tm}) · e^(k·t)",
        f"k = {k:.6g}",
        f"T(t) = {req.Tm} + ({req.T0 - req.Tm}) · e^({k:.6g} · t)",
    ]
))`,
        explicacion: "C₁ se calcula como T₀ - Tₘ (diferencia inicial). Los f-strings insertan los valores con formato :.6g. Si el resultado es negativo (enfriamiento), se muestra el signo en el exponente.",
      },
    ],
  },
  {
    id: "ods",
    titulo: "Solucionador general de EDO",
    icono: "🔧",
    intro: "La función `solve_differential_equation` en `ode_solver.py` es el motor genérico que resuelve cualquier EDO exacta o no exacta usando Sympy. A diferencia de los modelos anteriores, aquí Sympy hace el trabajo pesado.",
    pasos: [
      {
        codigo: `import sympy as sp
from app.models.schemas import StepDetail

def solve_differential_equation(M: str, N: str, variable: str = "x"):
    x, y = sp.symbols(f"{variable} y")`,
        explicacion: "🔷 **SymPy usó `sp.symbols()`** para crear variables simbólicas. La variable independiente la elige el usuario (x por defecto). La variable dependiente siempre es y. Todo es simbólico desde el inicio: sin números, solo símbolos.",
      },
      {
        codigo: `M_expr = sp.sympify(M)
N_expr = sp.sympify(N)`,
        explicacion: "🔷 **SymPy usó `sp.sympify()`** para parsear strings como 'k*y' o '-1' en objetos `Expr`. Por ejemplo 'k*y' se convierte en `Mul(Symbol('k'), Symbol('y'))`. Si el string no es válido, lanza SympifyError que la API captura como HTTP 400.",
      },
      {
        codigo: `M_y = sp.diff(M_expr, y)   # ∂M/∂y
N_x = sp.diff(N_expr, x)   # ∂N/∂x`,
        explicacion: "🔷 **SymPy usó `sp.diff()`** para calcular derivadas parciales simbólicamente. Por ejemplo, si M = k*y, `sp.diff(M, y)` = k (objeto `Symbol`). Si N = -1, `sp.diff(N, x)` = 0 (objeto `Zero`). SymPy mantiene k como símbolo; no necesita su valor numérico.",
      },
      {
        codigo: `if sp.simplify(M_y - N_x) == 0:
    # La ecuación es exacta
    F, solve_steps = solve_exact(M, N, x, y)
else:
    # Buscar factor integrante
    F, factor, solve_steps, method = solve_not_exact(M, N, x, y)`,
        explicacion: "🔷 **SymPy usó `sp.simplify()`** para reducir `M_y - N_x` a su forma más simple. Si es exactamente 0 (objeto `SymPy.Zero`), la ecuación es exacta y se llama a `solve_exact()`. Si no, `solve_not_exact()` busca un factor integrante μ(x) o μ(y) usando más métodos de SymPy.",
      },
      {
        codigo: `# Dentro de solve_exact():
F_x = sp.integrate(M_expr, x)          # ∫ M dx
g_y = sp.integrate(N_expr - sp.diff(F_x, y), y)
F = sp.simplify(F_x + g_y)`,
        explicacion: "🔷 **SymPy usó `sp.integrate()`** para ∫ M dx, luego `sp.diff(F_x, y)` para derivar y comparar con N, de nuevo `sp.integrate()` para hallar g(y), y finalmente `sp.simplify()` para construir F(x,y). Todo es simbólico: no se evalúan números, solo se manipulan expresiones algebraicas.",
      },
      {
        codigo: `# Dentro de solve_not_exact():
expr1 = sp.simplify(diff / N_expr)    # (∂M/∂y - ∂N/∂x)/N
if not expr1.has(y):                   # ¿depende solo de x?
    mu = sp.exp(sp.integrate(expr1, x))
    factor = sp.simplify(mu)
    method = "factor_integrante_x"`,
        explicacion: "🔷 **SymPy usó tres métodos**: `sp.simplify()` para reducir `(∂M/∂y-∂N/∂x)/N`, `expr.has(y)` para verificar si depende solo de x, y **`sp.integrate()` + `sp.exp()`** para construir μ(x) = e^∫ expresión dx. Luego prueba lo mismo para μ(y) con `-diff/M` y `expr.has(x)`.",
      },
      {
        codigo: `# Construcción de pasos
steps.append(StepDetail(
    title=f"Paso {n}: ...",
    substeps=[
        f"M(x,y) = {M_expr}",
        f"∂M/∂y = {M_y}",
        ...
    ]
))`,
        explicacion: "Cada operación sympy se registra en steps tan pronto como se ejecuta. Los f-strings convierten los objetos sympy a su representación LaTeX-like (str). Así el frontend recibe tanto el resultado como su explicación.",
      },
      {
        codigo: `return {
    "exact": True,       # o False
    "solution": str(F) + " = C",
    "integrating_factor": str(factor) if factor else None,
    "method": method,    # "exacta", "factor_integrante_x", etc.
    "steps": steps,
}`,
        explicacion: "El resultado incluye banderas que el frontend usa para mostrar diferente información: si es exacta, el factor integrante encontrado, el método usado y todos los pasos. str(F) convierte la expresión sympy a string para enviarla por JSON.",
      },
    ],
  },
];

export function SympyPanel() {
  const [activo, setActivo] = useState<ModeloId | null>(null);

  return (
    <div className="sympy-panel">
      <h2>🧠 Sympy: Motor Simbólico</h2>
      <p className="sympy-subtitle">
        Código real del backend que resuelve cada modelo. Cada paso muestra la línea de código ejecutada y una explicación de lo que hace.
      </p>

      <div className="sympy-modelos">
        {modelos.map((m) => (
          <div key={m.id} className="sympy-modelo-card">
            <div
              className="sympy-modelo-header"
              onClick={() => setActivo(activo === m.id ? null : m.id)}
            >
              <span className="sympy-modelo-icon">{m.icono}</span>
              <span className="sympy-modelo-titulo">{m.titulo}</span>
              <span className="sympy-modelo-toggle">
                {activo === m.id ? "▲" : "▼"}
              </span>
            </div>

            {activo === m.id && (
              <div className="sympy-modelo-body">
                <p className="sympy-modelo-desc">{m.intro}</p>
                <div className="sympy-pasos">
                  {m.pasos.map((p, i) => (
                    <div key={i} className="sympy-paso">
                      <div className="sympy-paso-num">{i + 1}</div>
                      <div className="sympy-paso-contenido">
                        <pre className="sympy-code sympy-paso-code">{p.codigo}</pre>
                        <p className="sympy-paso-expl">{p.explicacion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
