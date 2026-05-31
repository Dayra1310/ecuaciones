import { useEffect } from "react";
import type { StepDetail } from "../types/equation";

interface Props {
  steps: StepDetail[];
  title: string;
  onClose: () => void;
}

export function StepsModal({ steps, title, onClose }: Props) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          {steps.map((step, stepIndex) => (
            <div key={stepIndex} className="step-section">
              <h3 className="step-title">{step.title}</h3>
              <div className="substeps">
                {step.substeps.map((substep, subIndex) => (
                  <div
                    key={subIndex}
                    className={`substep ${substep.trim() === "" ? "substep-empty" : ""}`}
                  >
                    {substep.trim() === "" ? (
                      <div className="empty-line" />
                    ) : (
                      <pre>{substep}</pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
