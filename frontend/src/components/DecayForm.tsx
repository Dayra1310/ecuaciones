import { useState, useRef } from "react";
import { getRandomDecaimientoEjercicios } from "../data/decaimientoEjercicios";
import type { DecaimientoEjercicio } from "../data/decaimientoEjercicios";

interface Props {
  onSolve: (A1: number, A2: number, t: number) => void;
  isLoading: boolean;
  defaultA1?: string;
  defaultT?: string;
  defaultA2?: string;
}

const DEFAULT_CONTEXTO = "Una sustancia radiactiva se desintegra a una tasa proporcional a la cantidad presente.";
const DEFAULT_ENTIDAD = "g";
const DEFAULT_VARIABLE = "A";

export function DecayForm({ onSolve, isLoading, defaultA1 = "", defaultT = "", defaultA2 = "" }: Props) {
  const [A1, setA1] = useState(defaultA1);
  const [t, setT] = useState(defaultT);
  const [A2, setA2] = useState(defaultA2);
  const [contexto, setContexto] = useState(DEFAULT_CONTEXTO);
  const [entidad, setEntidad] = useState(DEFAULT_ENTIDAD);
  const [variable, setVariable] = useState(DEFAULT_VARIABLE);
  const a1Ref = useRef<HTMLInputElement>(null);
  const tRef = useRef<HTMLInputElement>(null);
  const a2Ref = useRef<HTMLInputElement>(null);

  const [showEjercicios, setShowEjercicios] = useState(false);
  const [ejercicios, setEjercicios] = useState<DecaimientoEjercicio[]>(() => getRandomDecaimientoEjercicios(5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a1 = parseFloat(A1);
    const time = parseFloat(t);
    const a2 = parseFloat(A2);
    if (isNaN(a1) || isNaN(time) || isNaN(a2)) return;
    onSolve(a1, a2, time);
  };

  const selectEjercicio = (ej: DecaimientoEjercicio) => {
    setA1(ej.A1);
    setT(ej.t);
    setA2(ej.A2);
    setContexto(ej.contexto);
    setEntidad(ej.entidad);
    setVariable(ej.variable);
    setShowEjercicios(false);
  };

  const refreshEjercicios = () => {
    setEjercicios(getRandomDecaimientoEjercicios(5));
  };

  return (
    <form onSubmit={handleSubmit} className="equation-form">
      <h2>Decaimiento radiactivo</h2>
      <p className="form-subtitle">Modelo: dA/dt = -k·A</p>

      <div className="problem-statement">
        <p>
          Haga clic en un valor del enunciado para editar el campo correspondiente:
        </p>
        <p className="statement-clickable">
          {contexto} Inicialmente hay{" "}
          <span className="clickable-value" onClick={() => a1Ref.current?.focus()}>{A1 || "?"}</span>
          {" "}{entidad} y después de{" "}
          <span className="clickable-value" onClick={() => tRef.current?.focus()}>{t || "?"}</span>
          {" "}horas quedan{" "}
          <span className="clickable-value" onClick={() => a2Ref.current?.focus()}>{A2 || "?"}</span>
          {" "}{entidad}. a) Modele el problema. b) Encuentre la función {variable}(t). c) Determine la vida media.
        </p>
      </div>

      <div className="input-group">
         <label htmlFor="A1">Cantidad inicial en {entidad} (A₀)</label>
        <input
          ref={a1Ref}
          id="A1"
          type="number"
          step="any"
          value={A1}
          onChange={(e) => setA1(e.target.value)}
          placeholder="Ej: 100"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="t">Tiempo transcurrido en horas (t)</label>
        <input
          ref={tRef}
          id="t"
          type="number"
          step="any"
          value={t}
          onChange={(e) => setT(e.target.value)}
          placeholder="Ej: 5"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="A2">Cantidad restante en {entidad} A(t)</label>
        <input
          ref={a2Ref}
          id="A2"
          type="number"
          step="any"
          value={A2}
          onChange={(e) => setA2(e.target.value)}
          placeholder="Ej: 60"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Calculando..." : "Calcular decaimiento"}
      </button>

      <button type="button" className="exercises-btn" onClick={() => { setEjercicios(getRandomDecaimientoEjercicios(5)); setShowEjercicios(true); }}>
        Revisar ejercicios similares
      </button>

      {showEjercicios && (
        <div className="modal-overlay" onClick={() => setShowEjercicios(false)}>
          <div className="modal-content ejercicios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ejercicios de decaimiento radiactivo</h2>
              <button className="modal-close" onClick={() => setShowEjercicios(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="ejercicios-hint">Selecciona un ejercicio para cargar sus datos en el formulario:</p>
              <div className="ejercicios-list">
                {ejercicios.map((ej) => (
                  <button key={ej.id} className="ejercicio-card" onClick={() => selectEjercicio(ej)}>
                    <span className="ejercicio-id">#{ej.id}</span>
                    <span className="ejercicio-text">
                      {ej.contexto} Inicialmente hay {ej.A1} {ej.entidad} y después de {ej.t} horas quedan {ej.A2}.
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
