import { useState, useMemo } from "react";
import type { PopulationGrowthResponse, StepDetail } from "../types/equation";
import { StepsModal } from "./StepsModal";
import { formatNum } from "../utils/format";

interface Props {
  result: PopulationGrowthResponse;
  P0: number;
  t2: number;
  popAtT2: number | null;
}

export function PopulationResult({ result, P0, t2, popAtT2 }: Props) {
  const [showSteps, setShowSteps] = useState(false);

  const stepsWithExtra = useMemo(() => {
    if (popAtT2 === null) {
      return result.steps;
    }

    const extraStep: StepDetail = {
      title: "Paso 5: Cálculo de la población en el tiempo t₂",
      substeps: [
        "Datos para el nuevo cálculo:",
        `  • t₂ = ${t2} (nuevo tiempo)`,
        `  • k = ${formatNum(result.k)} (constante de crecimiento)`,
        `  • P₀ = ${P0} (población inicial)`,
        "",
        "Paso 5.1: Usar la función P(t) obtenida",
        `  P(t) = ${P0} · e^(${formatNum(result.k)} · t)`,
        "",
        "Paso 5.2: Sustituir t = t₂",
        `  P(${t2}) = ${P0} · e^(${formatNum(result.k)} · ${t2})`,
        `  P(${t2}) = ${P0} · e^(${formatNum(result.k * t2)})`,
        "",
        "Paso 5.3: Calcular el exponencial",
        `  e^(${formatNum(result.k * t2)}) = ${formatNum(Math.exp(result.k * t2))}`,
        "",
        "Paso 5.4: Calcular la población final",
        `  P(${t2}) = ${P0} · ${formatNum(Math.exp(result.k * t2))}`,
        `  P(${t2}) = ${formatNum(popAtT2)}`,
        "",
        `Resultado: En t = ${t2}, la población será de aproximadamente ${formatNum(popAtT2, 2)} habitantes.`,
      ],
    };

    return [...result.steps, extraStep];
  }, [result.steps, popAtT2, t2, result.k, P0]);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="badge exact">CRECIMIENTO POBLACIONAL</span>
      </div>

      <div className="solution">
        <h3>Constante de crecimiento (k)</h3>
        <div className="math">k = {result.k}</div>
      </div>

      <div className="solution">
        <h3>Solución Particular</h3>
        <div className="math">{result.solution}</div>
      </div>

      {popAtT2 !== null && (
        <div className="project-result">
          <span className="project-label">Población en t = {t2}:</span>
          <span className="project-value">{formatNum(popAtT2, 2)} habitantes</span>
        </div>
      )}

      <button className="steps-btn" onClick={() => setShowSteps(true)}>
        Ver pasos detallados ({stepsWithExtra.length} pasos)
      </button>

      {showSteps && (
        <StepsModal
          steps={stepsWithExtra}
          title="Crecimiento Poblacional - Pasos detallados"
          onClose={() => setShowSteps(false)}
        />
      )}
    </div>
  );
}
