import { useState, useMemo } from "react";
import type { NewtonCoolingResponse, StepDetail } from "../types/equation";
import { StepsModal } from "./StepsModal";
import { formatNum } from "../utils/format";

interface Props {
  result: NewtonCoolingResponse;
  Tm: number;
  T0: number;
  t2: number;
  tempAtT2: number | null;
}

export function NewtonResult({ result, Tm, T0, t2, tempAtT2 }: Props) {
  const [showSteps, setShowSteps] = useState(false);

  const stepsWithExtra = useMemo(() => {
    if (tempAtT2 === null) {
      return result.steps;
    }

    const extraStep: StepDetail = {
      title: "Paso 5: Cálculo de la temperatura en el tiempo t₂",
      substeps: [
        "Datos para el nuevo cálculo:",
        `  • t₂ = ${t2} (nuevo tiempo)`,
        `  • k = ${formatNum(result.k)} (constante de ${result.k < 0 ? "enfriamiento" : "calentamiento"})`,
        `  • Tₘ = ${Tm} ° (temperatura ambiente)`,
        `  • T₀ = ${T0} ° (temperatura inicial)`,
        "",
        "Paso 5.1: Usar la función T(t) obtenida",
        `  T(t) = ${Tm} + (${T0 - Tm}) · e^(${formatNum(result.k)} · t)`,
        "",
        "Paso 5.2: Sustituir t = t₂",
        `  T(${t2}) = ${Tm} + (${T0 - Tm}) · e^(${formatNum(result.k)} · ${t2})`,
        `  T(${t2}) = ${Tm} + (${T0 - Tm}) · e^(${formatNum(result.k * t2)})`,
        "",
        "Paso 5.3: Calcular el exponencial",
        `  e^(${formatNum(result.k * t2)}) = ${formatNum(Math.exp(result.k * t2))}`,
        "",
        "Paso 5.4: Calcular el producto",
        `  (${T0 - Tm}) · ${formatNum(Math.exp(result.k * t2))} = ${formatNum((T0 - Tm) * Math.exp(result.k * t2))}`,
        "",
        "Paso 5.5: Calcular la temperatura final",
        `  T(${t2}) = ${Tm} + ${formatNum((T0 - Tm) * Math.exp(result.k * t2))}`,
        `  T(${t2}) = ${formatNum(tempAtT2)}`,
        "",
        `Resultado: En t = ${t2}, la temperatura será de aproximadamente ${formatNum(tempAtT2, 2)} °.`,
      ],
    };

    return [...result.steps, extraStep];
  }, [result.steps, tempAtT2, t2, result.k, Tm, T0]);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="badge not-exact">LEY DE NEWTON</span>
      </div>

      <div className="solution">
        <h3>Constante de enfriamiento (k)</h3>
        <div className="math">k = {result.k}</div>
      </div>

      <div className="solution">
        <h3>Solución Particular</h3>
        <div className="math">{result.solution}</div>
      </div>

      {tempAtT2 !== null && (
        <div className="project-result">
          <span className="project-label">Temperatura en t = {t2}:</span>
          <span className="project-value">{formatNum(tempAtT2, 2)} °</span>
        </div>
      )}

      <button className="steps-btn" onClick={() => setShowSteps(true)}>
        Ver pasos detallados ({stepsWithExtra.length} pasos)
      </button>

      {showSteps && (
        <StepsModal
          steps={stepsWithExtra}
          title="Ley de Enfriamiento de Newton - Pasos detallados"
          onClose={() => setShowSteps(false)}
        />
      )}
    </div>
  );
}
