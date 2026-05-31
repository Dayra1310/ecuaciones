import { useState, useRef } from "react";
import { getRandomEjercicios } from "../data/crecimientoEjercicios";
import type { CrecimientoEjercicio } from "../data/crecimientoEjercicios";

interface Props {
  onSolve: (P0: number, P: number, t: number, t2: number) => void;
  isLoading: boolean;
  defaultP0?: string;
  defaultT?: string;
  defaultP?: string;
  defaultT2?: string;
}

const DEFAULT_CONTEXTO = "La población de una comunidad crece proporcionalmente al número de habitantes presentes en el instante t.";
const DEFAULT_ENTIDAD = "habitantes";
const DEFAULT_VARIABLE = "P";

export function PopulationForm({ onSolve, isLoading, defaultP0 = "", defaultT = "", defaultP = "", defaultT2 = "" }: Props) {
  const [P0, setP0] = useState(defaultP0);
  const [t, setT] = useState(defaultT);
  const [P, setP] = useState(defaultP);
  const [t2, setT2] = useState(defaultT2);
  const [contexto, setContexto] = useState(DEFAULT_CONTEXTO);
  const [entidad, setEntidad] = useState(DEFAULT_ENTIDAD);
  const [variable, setVariable] = useState(DEFAULT_VARIABLE);
  const p0Ref = useRef<HTMLInputElement>(null);
  const tRef = useRef<HTMLInputElement>(null);
  const pRef = useRef<HTMLInputElement>(null);
  const t2Ref = useRef<HTMLInputElement>(null);

  const [showEjercicios, setShowEjercicios] = useState(false);
  const [ejercicios, setEjercicios] = useState<CrecimientoEjercicio[]>(() => getRandomEjercicios(5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p0 = parseFloat(P0);
    const time = parseFloat(t);
    const p = parseFloat(P);
    const time2 = parseFloat(t2);
    if (isNaN(p0) || isNaN(time) || isNaN(p) || isNaN(time2)) return;
    onSolve(p0, p, time, time2);
  };

  const selectEjercicio = (ej: CrecimientoEjercicio) => {
    setP0(ej.P0);
    setT(ej.t);
    setP(ej.P);
    setT2(ej.t2);
    setContexto(ej.contexto);
    setEntidad(ej.entidad);
    setVariable(ej.variable);
    setShowEjercicios(false);
  };

  const refreshEjercicios = () => {
    setEjercicios(getRandomEjercicios(5));
  };

  return (
    <form onSubmit={handleSubmit} className="equation-form">
      <h2>Crecimiento poblacional</h2>
      <p className="form-subtitle">Modelo: dP/dt = k·P</p>

      <div className="problem-statement">
        <p>
          Haga clic en un valor del enunciado para editar el campo correspondiente:
        </p>
        <p className="statement-clickable">
          {contexto} Inicialmente hay{" "}
          <span className="clickable-value" onClick={() => p0Ref.current?.focus()}>{P0 || "?"}</span>
          {" "}{entidad} y después de{" "}
          <span className="clickable-value" onClick={() => tRef.current?.focus()}>{t || "?"}</span>
          {" "}años hay{" "}
          <span className="clickable-value" onClick={() => pRef.current?.focus()}>{P || "?"}</span>.
          {" "}a) Plantee la solución general. b) Determine la función {variable}(t). c) Calcule la
          {entidad === "habitantes" ? " población" : ` cantidad de ${entidad}`} al cabo de{" "}
          <span className="clickable-value" onClick={() => t2Ref.current?.focus()}>{t2 || "?"}</span>
          {" "}años.
        </p>
      </div>

      <div className="input-group">
        <label htmlFor="P0">Población inicial (P₀)</label>
        <input
          ref={p0Ref}
          id="P0"
          type="number"
          step="any"
          value={P0}
          onChange={(e) => setP0(e.target.value)}
          placeholder="Ej: 100"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="t">Tiempo transcurrido en años (t)</label>
        <input
          ref={tRef}
          id="t"
          type="number"
          step="any"
          value={t}
          onChange={(e) => setT(e.target.value)}
          placeholder="Ej: 10"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="P">Población final P(t)</label>
        <input
          ref={pRef}
          id="P"
          type="number"
          step="any"
          value={P}
          onChange={(e) => setP(e.target.value)}
          placeholder="Ej: 200"
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="t2">Tiempo a proyectar en años (t₂)</label>
        <input
          ref={t2Ref}
          id="t2"
          type="number"
          step="any"
          min="0"
          value={t2}
          onChange={(e) => setT2(e.target.value)}
          placeholder="Ej: 8"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Calculando..." : "Calcular constante k"}
      </button>

      <button type="button" className="exercises-btn" onClick={() => { setEjercicios(getRandomEjercicios(5)); setShowEjercicios(true); }}>
        Revisar ejercicios similares
      </button>

      {showEjercicios && (
        <div className="modal-overlay" onClick={() => setShowEjercicios(false)}>
          <div className="modal-content ejercicios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ejercicios de crecimiento proporcional</h2>
              <button className="modal-close" onClick={() => setShowEjercicios(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="ejercicios-hint">Selecciona un ejercicio para cargar sus datos en el formulario:</p>
              <div className="ejercicios-list">
                {ejercicios.map((ej) => (
                  <button key={ej.id} className="ejercicio-card" onClick={() => selectEjercicio(ej)}>
                    <span className="ejercicio-id">#{ej.id}</span>
                    <span className="ejercicio-text">
                      {ej.contexto} Inicialmente hay {ej.P0} {ej.entidad} y después de {ej.t} años hay {ej.P}.
                    </span>
                  </button>
                ))}
              </div>
              <button className="refresh-btn" onClick={refreshEjercicios}>
                Mostrar otros 5 ejercicios
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
