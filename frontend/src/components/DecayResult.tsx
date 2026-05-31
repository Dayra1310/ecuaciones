import { useState } from "react";
import type { RadioactiveDecayResponse } from "../types/equation";
import { StepsModal } from "./StepsModal";

interface Props {
  result: RadioactiveDecayResponse;
}

export function DecayResult({ result }: Props) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="badge not-exact">DECAIMIENTO RADIACTIVO</span>
      </div>

      <div className="solution">
        <h3>Constante de decaimiento (k)</h3>
        <div className="math">k = {result.k}</div>
      </div>

      <div className="solution">
        <h3>Vida media (T₁/₂)</h3>
        <div className="math">T₁/₂ = {result.half_life}</div>
      </div>

      <div className="solution">
        <h3>Solución Particular</h3>
        <div className="math">{result.solution}</div>
      </div>

      <button className="steps-btn" onClick={() => setShowSteps(true)}>
        Ver pasos detallados ({result.steps.length} pasos)
      </button>

      {showSteps && (
        <StepsModal
          steps={result.steps}
          title="Decaimiento Radiactivo - Pasos detallados"
          onClose={() => setShowSteps(false)}
        />
      )}
    </div>
  );
}
