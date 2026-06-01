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
      "El modelo de crecimiento proporcional describe cómo una población (o cualquier cantidad) aumenta cuando su tasa de crecimiento es directamente proporcional a su tamaño actual. Este es uno de los modelos más fundamentales en ecuaciones diferenciales y aparece en múltiples disciplinas.",
      "A continuación desarrollamos paso a paso la solución de la ecuación diferencial.",
    ],
    steps: [
      {
        title: "1. Plantear la ecuación diferencial",
        content: "dP/dt = k·P\n\nLa velocidad de cambio de la población es proporcional a la población misma. k > 0 es la constante de crecimiento.",
      },
      {
        title: "2. Separar variables",
        content: "dP/P = k·dt\n\nReescribimos la ecuación para que cada variable quede en un lado de la igualdad.",
      },
      {
        title: "3. Integrar ambos lados",
        content: "∫ dP/P = ∫ k·dt\n\nIntegramos:\nln|P| = k·t + C",
      },
      {
        title: "4. Despejar P(t) — Solución general",
        content: "|P| = e^(k·t + C) = e^C · e^(k·t)\n\nP(t) = ±e^C · e^(k·t)\n\nLlamamos C₁ = ±e^C, y obtenemos:\nP(t) = C₁ · e^(k·t)",
      },
      {
        title: "5. Aplicar condición inicial P(0) = P₀",
        content: "P(0) = C₁ · e^(k·0) = C₁ · 1 = C₁\n\nPero P(0) = P₀, por lo tanto:\nC₁ = P₀",
      },
      {
        title: "6. Solución particular",
        content: "P(t) = P₀ · e^(k·t)\n\nEsta función exponencial describe el crecimiento continuo de la población en el tiempo.",
      },
    ],
    solution: "P(t) = P₀ · e^(kt)",
  },
  decaimiento: {
    title: "Decaimiento radiactivo",
    subtitle: "Modelo de desintegración nuclear",
    paragraphs: [
      "El modelo de decaimiento radiactivo describe cómo los núcleos atómicos inestables se desintegran espontáneamente con el tiempo. La tasa de desintegración es proporcional a la cantidad de material radiactivo presente, lo que significa que el material se desintegra exponencialmente.",
      "A continuación desarrollamos paso a paso la solución de la ecuación diferencial.",
    ],
    steps: [
      {
        title: "1. Plantear la ecuación diferencial",
        content: "dA/dt = -k·A\n\nLa velocidad de desintegración es proporcional a la cantidad presente. El signo negativo indica que la cantidad disminuye con el tiempo. k > 0 es la constante de decaimiento.",
      },
      {
        title: "2. Separar variables",
        content: "dA/A = -k·dt\n\nReescribimos la ecuación para separar las variables A y t.",
      },
      {
        title: "3. Integrar ambos lados",
        content: "∫ dA/A = -∫ k·dt\n\nIntegramos:\nln|A| = -k·t + C",
      },
      {
        title: "4. Despejar A(t) — Solución general",
        content: "|A| = e^(-k·t + C) = e^C · e^(-k·t)\n\nA(t) = ±e^C · e^(-k·t)\n\nLlamamos C₁ = ±e^C, y obtenemos:\nA(t) = C₁ · e^(-k·t)",
      },
      {
        title: "5. Aplicar condición inicial A(0) = A₀",
        content: "A(0) = C₁ · e^(-k·0) = C₁ · 1 = C₁\n\nPero A(0) = A₀, por lo tanto:\nC₁ = A₀",
      },
      {
        title: "6. Solución particular",
        content: "A(t) = A₀ · e^(-k·t)\n\nLa cantidad de material decae exponencialmente. La vida media T₁/₂ = ln(2)/k es el tiempo necesario para que se desintegre la mitad del material.",
      },
    ],
    solution: "A(t) = A₀ · e^(-kt)",
  },
  newton: {
    title: "Ley de Enfriamiento de Newton",
    subtitle: "Modelo de transferencia de calor",
    paragraphs: [
      "La Ley de Enfriamiento de Newton describe cómo la temperatura de un cuerpo cambia cuando está en contacto con un medio ambiente a una temperatura diferente. La tasa de cambio de temperatura es proporcional a la diferencia entre la temperatura del cuerpo y la temperatura ambiente.",
      "A continuación desarrollamos paso a paso la solución de la ecuación diferencial.",
    ],
    steps: [
      {
        title: "1. Plantear la ecuación diferencial",
        content: "dT/dt = k·(T - Tₘ)\n\nLa velocidad de cambio de temperatura es proporcional a la diferencia entre la temperatura del cuerpo T y la temperatura ambiente Tₘ. k < 0 cuando el cuerpo se enfría.",
      },
      {
        title: "2. Separar variables",
        content: "dT/(T - Tₘ) = k·dt\n\nSeparamos las variables T y t en cada lado de la ecuación.",
      },
      {
        title: "3. Integrar ambos lados",
        content: "∫ dT/(T - Tₘ) = ∫ k·dt\n\nIntegramos. Para la integral del lado izquierdo, hacemos u = T - Tₘ, du = dT:\nln|T - Tₘ| = k·t + C",
      },
      {
        title: "4. Despejar T(t) — Solución general",
        content: "|T - Tₘ| = e^(k·t + C) = e^C · e^(k·t)\n\nT - Tₘ = ±e^C · e^(k·t)\n\nLlamamos C₁ = ±e^C:\nT(t) = Tₘ + C₁ · e^(k·t)",
      },
      {
        title: "5. Aplicar condición inicial T(0) = T₀",
        content: "T(0) = Tₘ + C₁ · e^(k·0) = Tₘ + C₁\n\nPero T(0) = T₀, por lo tanto:\nT₀ = Tₘ + C₁ ⇒ C₁ = T₀ - Tₘ",
      },
      {
        title: "6. Solución particular",
        content: "T(t) = Tₘ + (T₀ - Tₘ) · e^(k·t)\n\nLa temperatura del cuerpo se aproxima asintóticamente a la temperatura ambiente Tₘ a medida que t → ∞.",
      },
    ],
    solution: "T(t) = Tₘ + (T₀ - Tₘ) · e^(kt)",
  },
  c14: {
    title: "Carbono-14",
    subtitle: "Método de datación radiométrica",
    paragraphs: [
      "El método de datación por Carbono-14 es una técnica radiométrica que permite determinar la edad de materiales orgánicos antiguos. Se basa en la desintegración radiactiva del isótopo ¹⁴C, que los organismos vivos absorben durante su vida y comienza a decaer al morir.",
      "A diferencia del decaimiento radiactivo general, aquí la constante k está fijada por la vida media del ¹⁴C (5730 años), por lo que el problema típico es: dada la concentración inicial N₀ y la concentración actual N, encontrar la edad t de la muestra.",
      "A continuación desarrollamos paso a paso la solución de la ecuación diferencial.",
    ],
    steps: [
      {
        title: "1. Plantear la ecuación diferencial",
        content: "dN/dt = -k·N\n\nk es la constante de decaimiento. Para el ¹⁴C, la vida media es de 5730 años, por lo que k = ln(2)/5730 ≈ 0.000121 años⁻¹.",
      },
      {
        title: "2. Separar variables",
        content: "dN/N = -k·dt\n\nSeparamos las variables N y t.",
      },
      {
        title: "3. Integrar ambos lados",
        content: "∫ dN/N = -∫ k·dt\n\nIntegramos:\nln|N| = -k·t + C\n\nAplicamos exponencial para eliminar ln:\ne^(ln|N|) = e^(-k·t + C)",
      },
      {
        title: "4. Despejar N(t) — Solución general",
        content: "|N| = e^C · e^(-k·t)\n\nN(t) = ±e^C · e^(-k·t)\n\nN(t) = C · e^(-k·t)  donde C = ±e^C",
      },
      {
        title: "5. Aplicar condición inicial N(0) = N₀",
        content: "N(0) = C · e^(-k·0) = C\n\nPero N(0) = N₀, por lo tanto:\nC = N₀",
      },
      {
        title: "6. Determinar k usando la vida media",
        content: "Sabemos que la vida media del ¹⁴C es 5730 años:\n  N(5730) = N₀ / 2\n\nSustituimos en la solución particular:\n  N₀ · e^(-k · 5730) = N₀ / 2\n\nCancelamos N₀:\n  e^(-k · 5730) = 1/2\n\nAplicamos logaritmo natural:\n  ln(e^(-k · 5730)) = ln(1/2)\n  -k · 5730 = -ln(2)\n  k · 5730 = ln(2)\n\nDespejamos k:\n  k = ln|2| / 5730",
      },
      {
        title: "7. Solución particular del modelo",
        content: "Reemplazamos k en la solución particular:\n  N(t) = N₀ · e^(-k·t)\n  N(t) = N₀ · e^(-(ln|2|/5730) · t)\n\nAplicamos propiedades de exponencial y logaritmo:\n  e^(ln|2|) = 2\n\nReescribimos:\n  N(t) = N₀ · (e^(ln|2|))^(-t/5730)\n  N(t) = N₀ · 2^(-t/5730)\n  N(t) = N₀ · (1/2)^(t/5730)",
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
