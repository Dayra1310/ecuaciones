import { useState } from "react";
import type { EquationResponse } from "../types/equation";
import { StepsModal } from "./StepsModal";

interface Props {
  result: EquationResponse;
}

export function ResultCard({ result }: Props) {
  const badgeClass = result.exact ? "badge exact" : "badge not-exact";
  const badgeText = result.exact ? "EXACTA" : "NO EXACTA";
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className={badgeClass}>{badgeText}</span>
        {result.method && <span className="method">{result.method}</span>}
      </div>

      {result.solution ? (
        <div className="solution">
          <h3>Solución General</h3>
          <div className="math">{result.solution}</div>
        </div>
      ) : (
        <p className="no-solution">No se pudo encontrar una solución con los métodos disponibles.</p>
      )}

      {result.integrating_factor && (
        <div className="factor">
          <h3>Factor Integrante</h3>
          <div className="math">μ = {result.integrating_factor}</div>
        </div>
      )}

      <button className="steps-btn" onClick={() => setShowSteps(true)}>
        Ver pasos detallados ({result.steps.length} pasos)
      </button>

      {showSteps && (
        <StepsModal
          steps={result.steps}
          title="Ecuación Diferencial - Pasos detallados"
          onClose={() => setShowSteps(false)}
        />
      )}
    </div>
  );
}
