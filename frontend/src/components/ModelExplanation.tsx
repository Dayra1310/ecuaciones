import type { EquationOption } from "./EquationMenu";

interface Props {
  option: EquationOption;
  onContinue: () => void;
  onBack: () => void;
}

interface ModelData {
  title: string;
  subtitle: string;
  paragraphs: string[];
  steps: { title: string; content: string }[];
  solution: string;
}

const modelData: Record<string, ModelData> = {
  crecimiento: {
    title: "Crecimiento proporcional",
    subtitle: "Modelo de crecimiento poblacional",
    paragraphs: [
      "El modelo de crecimiento proporcional describe cómo una población (o cualquier cantidad) aumenta cuando su tasa de crecimiento es directamente proporcional a su tamaño actual.",
      "SymPy resuelve esta EDO simbólicamente: clasifica la ecuación, aplica separación de variables o dsolve, y obtiene la solución general. Luego, usando las condiciones iniciales, encuentra la solución particular y despeja k.",
    ],
    steps: [
      {
        title: "1. Definir la EDO en SymPy",
        content: "t, k = symbols('t k')\nP = Function('P')\node = Eq(Derivative(P(t), t), k * P(t))\n\nSymPy representa la ecuación dP/dt = k·P como un objeto simbólico.",
      },
      {
        title: "2. Clasificar con classify_ode",
        content: "classify_ode(ode, P(t))\n# → separable, 1st_exact, 1st_linear, Bernoulli...\n\nSymPy identifica automáticamente que es una EDO de 1er orden, lineal, separable y exacta.",
      },
      {
        title: "3. Separar variables (paso intermedio)",
        content: "∫ 1/P dP = ∫ k dt\n\nSymPy computa las integrales simbólicamente:\n  integrate(1/P, P) → log(P)\n  integrate(k, (t,)) → k*t\n\nResultado: log(P) = k*t + C₁",
      },
      {
        title: "4. Solución general con dsolve",
        content: "dsolve(ode, P(t))\n# → Eq(P(t), C₁*exp(k*t))\n\nSymPy resuelve la EDO y devuelve la solución general con una constante arbitraria C₁.",
      },
      {
        title: "5. Aplicar condición inicial con ics",
        content: "dsolve(ode, P(t), ics={P(0): P₀})\n# → Eq(P(t), P₀*exp(k*t))\n\nSymPy sustituye t = 0 y P(0) = P₀ para determinar C₁ = P₀.",
      },
      {
        title: "6. Despejar k con solve",
        content: "solve(Eq(P₀*exp(k*t₁), P₁), k)\n# → [log(P₁/P₀)/t₁]\n\nSymPy despeja k usando el segundo dato y obtiene la solución particular completa.",
      },
    ],
    solution: "P(t) = P₀ · e^(kt)",
  },
  decaimiento: {
    title: "Decaimiento radiactivo",
    subtitle: "Modelo de desintegración nuclear",
    paragraphs: [
      "El modelo de decaimiento radiactivo describe cómo los núcleos atómicos inestables se desintegran espontáneamente. La tasa de desintegración es proporcional a la cantidad presente.",
      "SymPy resuelve esta EDO de forma análoga al crecimiento, pero con signo negativo. El proceso simbólico es idéntico: classify_ode → dsolve → ics → solve.",
    ],
    steps: [
      {
        title: "1. Definir la EDO en SymPy",
        content: "t, k = symbols('t k')\nA = Function('A')\node = Eq(Derivative(A(t), t), -k * A(t))\n\nLa ecuación dA/dt = -k·A se define con el signo negativo en el coeficiente.",
      },
      {
        title: "2. Clasificar con classify_ode",
        content: "classify_ode(ode, A(t))\n# → separable, 1st_exact, 1st_linear, Bernoulli...\n\nSymPy identifica que es lineal, separable, homogénea y exacta.",
      },
      {
        title: "3. Separar variables",
        content: "∫ 1/A dA = ∫ -k dt\n\nSymPy integra:\n  integrate(1/A, A) → log(A)\n  integrate(-k, (t,)) → -k*t\n\nResultado: log(A) = -k*t + C₁",
      },
      {
        title: "4. Solución general con dsolve",
        content: "dsolve(ode, A(t))\n# → Eq(A(t), C₁*exp(-k*t))\n\nSymPy obtiene la solución general directamente.",
      },
      {
        title: "5. Aplicar condición inicial con ics",
        content: "dsolve(ode, A(t), ics={A(0): A₀})\n# → Eq(A(t), A₀*exp(-k*t))\n\nSymPy determina C₁ = A₀ automáticamente.",
      },
      {
        title: "6. Despejar k y vida media",
        content: "solve(Eq(A₀*exp(-k*t₁), A₂), k)\n# → [-log(A₂/A₀)/t₁]\n\nSymPy despeja k. Luego calcula la vida media:\n  T₁/₂ = ln(2) / k",
      },
    ],
    solution: "A(t) = A₀ · e^(-kt)",
  },
  newton: {
    title: "Ley de Enfriamiento de Newton",
    subtitle: "Modelo de transferencia de calor",
    paragraphs: [
      "La Ley de Enfriamiento de Newton describe cómo la temperatura de un cuerpo cambia cuando está en contacto con un medio a diferente temperatura. La tasa de cambio es proporcional a la diferencia de temperaturas.",
      "SymPy resuelve esta EDO considerando Tₘ como un parámetro simbólico, y lo sustituye al final.",
    ],
    steps: [
      {
        title: "1. Definir la EDO en SymPy",
        content: "t, k, Tm = symbols('t k Tm')\nT = Function('T')\node = Eq(Derivative(T(t), t), k * (T(t) - Tm))\n\nTₘ se define como símbolo para que SymPy lo trate como parámetro.",
      },
      {
        title: "2. Clasificar con classify_ode",
        content: "classify_ode(ode, T(t))\n# → 1st_linear, Bernoulli, separable, 1st_exact...\n\nSymPy identifica que es lineal, separable y de 1er orden, pero NO homogénea (por el término -k·Tₘ).",
      },
      {
        title: "3. Separar variables",
        content: "∫ 1/(T - Tₘ) dT = ∫ k dt\n\nSymPy integra:\n  integrate(1/(T - Tm), T) → log(T - Tm)\n  integrate(k, (t,)) → k*t\n\nResultado: log(T - Tₘ) = k*t + C₁",
      },
      {
        title: "4. Solución general con dsolve",
        content: "dsolve(ode, T(t))\n# → Eq(T(t), Tm + C₁*exp(k*t))\n\nSymPy resuelve la EDO con Tₘ como parámetro simbólico.",
      },
      {
        title: "5. Aplicar condición inicial con ics",
        content: "dsolve(ode, T(t), ics={T(0): T₀})\n# → Eq(T(t), Tm + (T₀ - Tm)*exp(k*t))\n\nSymPy determina C₁ = T₀ - Tₘ a partir de T(0) = T₀.",
      },
      {
        title: "6. Despejar k con solve",
        content: "solve(Eq(Tₘ + (T₀-Tₘ)*exp(k*t₁), T₁), k)\n# → [ln((T₁-Tₘ)/(T₀-Tₘ))/t₁]\n\nSymPy despeja k. Luego sustituye el valor numérico de Tₘ para obtener la solución particular.",
      },
    ],
    solution: "T(t) = Tₘ + (T₀ - Tₘ) · e^(kt)",
  },
  c14: {
    title: "Carbono-14",
    subtitle: "Método de datación radiométrica",
    paragraphs: [
      "El método de datación por Carbono-14 permite determinar la edad de materiales orgánicos. Se basa en la desintegración del ¹⁴C, con una vida media de 5730 años.",
      "SymPy resuelve la misma EDO que el decaimiento radiactivo, pero aquí k está fijado por la vida media. El problema se reduce a despejar t (la edad) a partir de la concentración actual N.",
    ],
    steps: [
      {
        title: "1. Definir la EDO en SymPy",
        content: "t, k = symbols('t k')\nN = Function('N')\node = Eq(Derivative(N(t), t), -k * N(t))\n\nSymPy recibe k como símbolo aunque su valor sea conocido.",
      },
      {
        title: "2. Clasificar con classify_ode",
        content: "classify_ode(ode, N(t))\n# → separable, 1st_exact, 1st_linear...\n\nSymPy identifica el tipo de EDO.",
      },
      {
        title: "3. Solución general con dsolve",
        content: "dsolve(ode, N(t))\n# → Eq(N(t), C₁*exp(-k*t))\n\nSymPy obtiene la solución general con k como parámetro.",
      },
      {
        title: "4. Sustituir k conocido",
        content: "k = ln(2) / 5730\n\nSe conoce a partir de la vida media. SymPy sustituye:\n  N(t) = N₀ · exp(-ln(2)·t / 5730)\n  N(t) = N₀ · 2^(-t/5730)",
      },
      {
        title: "5. Aplicar condición inicial con ics",
        content: "dsolve(ode, N(t), ics={N(0): N₀})\n.subs(k, ln(2)/5730)\n# → Eq(N(t), N₀ * exp(-ln(2)*t/5730))\n\nSymPy determina C₁ = N₀ y sustituye el valor de k.",
      },
      {
        title: "6. Despejar t (edad) con solve",
        content: "solve(Eq(N₀*exp(-ln(2)*t/5730), N), t)\n# → [5730*log(N₀/N)/log(2)]\n\nSymPy resuelve para t y obtiene la edad de la muestra en años.",
      },
    ],
    solution: "N(t) = N₀ · (1/2)^(t/5730)",
  },
};

export function ModelExplanation({ option, onContinue, onBack }: Props) {
  const data = modelData[option.id];

  if (!data) return null;

  return (
    <div className="model-explanation">
      <button className="back-btn" onClick={onBack}>← Volver al menú</button>

      <div className="explanation-header">
        <div className="explanation-icon">{option.icon}</div>
        <div>
          <h2>{data.title}</h2>
          <p className="explanation-subtitle">{data.subtitle}</p>
        </div>
      </div>

      <div className="explanation-content">
        {data.paragraphs.map((p, i) => (
          p.startsWith("d") && p.includes("/") ? (
            <div key={i} className="explanation-formula">{p}</div>
          ) : (
            <p key={i} className="explanation-text">{p}</p>
          )
        ))}
      </div>

      <div className="explanation-development">
        <h3>Desarrollo paso a paso</h3>
        {data.steps.map((step, i) => (
          <div key={i} className="dev-step">
            <div className="dev-step-header">
              <span className="dev-step-number">{i + 1}</span>
              <strong>{step.title}</strong>
            </div>
            <div className="dev-step-content">
              {step.content.split("\n").map((line, j) => (
                line.trim() && /[=∫/→]/.test(line)
                  ? <span key={j} className="dev-step-formula">{line}</span>
                  : <span key={j}>{line}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="continue-btn" onClick={onContinue}>
        Continuar a resolver →
      </button>
    </div>
  );
}
