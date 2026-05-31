import { useState } from "react";
import type { C14DatingResponse } from "../types/equation";
import { StepsModal } from "./StepsModal";

interface Props {
  result: C14DatingResponse;
}

export function C14Result({ result }: Props) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="badge not-exact">CARBONO-14</span>
      </div>

      <div className="solution">
        <h3>Edad de la muestra (t)</h3>
        <div className="math">t = {result.age} años</div>
      </div>

      <div className="solution">
        <h3>Modelo utilizado</h3>
        <div className="math">{result.solution}</div>
      </div>

      <button className="steps-btn" onClick={() => setShowSteps(true)}>
        Ver pasos detallados ({result.steps.length} pasos)
      </button>

      {showSteps && (
        <StepsModal
          steps={result.steps}
          title="Carbono-14 - Pasos detallados"
          onClose={() => setShowSteps(false)}
        />
      )}
    </div>
  );
}
