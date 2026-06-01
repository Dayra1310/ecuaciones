import { useState } from "react";

type ModeloId = "crecimiento" | "decaimiento" | "c14" | "newton";

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
    intro: "Hoy el cálculo de k usa SymPy: se define la ecuación P₀·e^(k·t) = P simbólicamente y se despeja k con `sp.solve()`.",
    pasos: [
      {
        codigo: `import sympy as sp

k_sym = sp.symbols("k")
eq = sp.Eq(req.P0 * sp.exp(k_sym * req.t), req.P)
k = float(sp.solve(eq, k_sym)[0])`,
        explicacion: "SymPy crea un símbolo `k` con `sp.symbols()`, construye la ecuación `eq` usando `sp.Eq()` y `sp.exp()`, y la resuelve algebraicamente con `sp.solve()`. El resultado simbólico se convierte a float. Así se mantiene la relación matemática exacta sin resolver a mano.",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 4: Determinar la función P(t) y calcular k",
    substeps=[
        f"P(t) = {req.P0} · e^(k·t)",
        f"k = {k:.6g}",
        ...
    ]
))`,
        explicacion: "Los pasos se construyen con strings para la interfaz educativa. SymPy ya realizó el trabajo de despejar k; los pasos solo documentan el proceso para el estudiante.",
      },
      {
        codigo: `return PopulationGrowthResponse(
    k=round(k, 6),
    solution=f"P(t) = {req.P0} · e^({k:.6g} · t)",
    steps=steps,
)`,
        explicacion: "La respuesta es un Pydantic model con k (float), la solución como string y los pasos. El frontend tipa estos campos con TypeScript y los renderiza en PopulationResult.",
      },
    ],
  },
  {
    id: "decaimiento",
    titulo: "Decaimiento radiactivo",
    icono: "☢️",
    intro: "Ahora despeja k y calcula la vida media usando SymPy: resuelve A₁·e^(-k·t) = A₂ simbólicamente y usa `sp.log(2)/k` para T₁/₂.",
    pasos: [
      {
        codigo: `if req.A2 >= req.A1:
    raise HTTPException(
        status_code=400,
        detail="A2 debe ser menor que A1"
    )`,
        explicacion: "Validación: la cantidad final debe ser menor que la inicial. Si no, se rechaza con HTTP 400. Esto garantiza que la ecuación tenga solución físicamente significativa.",
      },
      {
        codigo: `k_sym = sp.symbols("k")
eq = sp.Eq(req.A1 * sp.exp(-k_sym * req.t), req.A2)
k = float(sp.solve(eq, k_sym)[0])`,
        explicacion: "SymPy resuelve A₁·e^(-k·t) = A₂ despejando k algebraicamente. `sp.exp(-k_sym * req.t)` modela el decaimiento con exponente negativo. `sp.solve()` opera sobre la ecuación simbólica y se convierte a float.",
      },
      {
        codigo: `half_life = float(sp.log(2) / k)`,
        explicacion: "La vida media se calcula con `sp.log(2)/k`. SymPy mantiene el logaritmo como expresión simbólica; `float()` lo evalúa numéricamente para incluirlo en la respuesta JSON.",
      },
      {
        codigo: `return RadioactiveDecayResponse(
    k=round(k, 6),
    half_life=round(half_life, 4),
    solution=f"A(t) = {req.A1} · e^(-{k:.6g} · t)",
    steps=steps,
)`,
        explicacion: "La respuesta incluye k y half_life calculados con SymPy. El frontend tipa estos campos y DecayResult los muestra en la interfaz.",
      },
    ],
  },
  {
    id: "c14",
    titulo: "Carbono-14",
    icono: "🦴",
    intro: "Ahora k y la edad se calculan con SymPy: `sp.log(2)/5730` para la constante, `-sp.log(N/N₀)/k` para la edad.",
    pasos: [
      {
        codigo: `from math import gcd

def ratio_fraction(num: float, den: float) -> str | None:
    n, d = round(num), round(den)
    if d == 0 or n == 0:
        return None
    g = gcd(n, d)
    nn, dd = n // g, d // g
    return f"{nn}/{dd}" if dd > 1 else None`,
        explicacion: "Función auxiliar para fracción irreducible. Convierte la relación N/N₀ a una fracción simplificada. `sp.nsimplify()` podría hacerlo automáticamente, pero se prefiere control manual sobre la fracción exacta.",
      },
      {
        codigo: `HALF_LIFE_C14 = 5730.0
k = float(sp.log(2) / HALF_LIFE_C14)`,
        explicacion: "k = `sp.log(2)/5730`. SymPy mantiene `sp.log(2)` como expresión simbólica; `float()` la evalúa al valor numérico ≈ 0.00012097.",
      },
      {
        codigo: `n_half = round(float(sp.log(req.N0 / req.N) / sp.log(2)))`,
        explicacion: "Se usa `sp.log()` para determinar si N/N₀ es potencia de 1/2. Ambos logaritmos (numerador y base) se calculan con SymPy.",
      },
      {
        codigo: `# Rama logarítmica (fracción no exacta):
age = float(-sp.log(req.N / req.N0) / k)`,
        explicacion: "La edad se calcula con `-sp.log(N/N₀)/k` usando SymPy. `float()` convierte el resultado simbólico a número.",
      },
      {
        codigo: `return C14DatingResponse(
    k=round(k, 8),
    age=round(age, 2),
    solution=f"N = {req.N0} · (1/2)^(t/5730)",
    steps=steps,
)`,
        explicacion: "La respuesta incluye k (de <code>sp.log(2)/5730</code>) y age (de <code>-sp.log(N/N₀)/k</code>), ambos calculados con SymPy internamente.",
      },
    ],
  },
  {
    id: "newton",
    titulo: "Ley de Enfriamiento de Newton",
    icono: "🌡️",
    intro: "Ahora despeja k con SymPy: resuelve Tₘ + (T₀-Tₘ)·e^(k·t) = T simbólicamente mediante `sp.solve()`.",
    pasos: [
      {
        codigo: `if req.T0 == req.Tm:
    raise HTTPException(
        status_code=400,
        detail="Temperatura inicial no puede ser igual a la ambiente"
    )`,
        explicacion: "Validación: si T₀ = Tₘ no hay gradiente térmico. La ecuación no tendría solución logarítmica porque (T-Tₘ)/(T₀-Tₘ) sería 0/0, por eso se rechaza.",
      },
      {
        codigo: `k_sym = sp.symbols("k")
eq = sp.Eq(
    req.Tm + (req.T0 - req.Tm) * sp.exp(k_sym * req.t),
    req.T
)
k = float(sp.solve(eq, k_sym)[0])`,
        explicacion: "SymPy construye la ecuación Tₘ + (T₀-Tₘ)·e^(k·t) = T con `sp.Eq()` y `sp.exp()`, y despeja k algebraicamente con `sp.solve()`. Si T está entre Tₘ y T₀, k resultará negativo (enfriamiento).",
      },
      {
        codigo: `steps.append(StepDetail(
    title="Paso 4: Determinar la función T(t) y calcular k",
    substeps=[
        f"C₁ = {req.T0} - {req.Tm} = {req.T0 - req.Tm}",
        f"k = {k:.6g}",
        ...
    ]
))`,
        explicacion: "Los f-strings documentan el resultado. SymPy ya realizó el despeje simbólico; los pasos son solo para la interfaz educativa del frontend.",
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
