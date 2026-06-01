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

      <div className="videos-section">
        <h3>Videos recomendados:</h3>
        <ul>
          <li><a href="https://www.youtube.com/watch?v=Qy2D50ax2js" target="_blank" rel="noopener noreferrer">Video 1</a></li>
          <li><a href="https://www.youtube.com/watch?v=iuEEuTO9Hns" target="_blank" rel="noopener noreferrer">Video 2</a></li>
        </ul>
      </div>

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
