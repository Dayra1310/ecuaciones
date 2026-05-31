import { useState, useRef } from "react";
import { getRandomNewtonEjercicios } from "../data/newtonEjercicios";
import type { NewtonEjercicio } from "../data/newtonEjercicios";

interface Props {
  onSolve: (Tm: number, T0: number, t: number, T: number, t2: number) => void;
  isLoading: boolean;
  defaultTm?: string;
  defaultT0?: string;
  defaultT?: string;
  defaultTFinal?: string;
  defaultT2?: string;
}

const DEFAULT_CONTEXTO = "Un objeto se enfría en un ambiente de 20°C.";

export function NewtonForm({ onSolve, isLoading, defaultTm = "", defaultT0 = "", defaultT = "", defaultTFinal = "", defaultT2 = "" }: Props) {
  const [Tm, setTm] = useState(defaultTm);
  const [T0, setT0] = useState(defaultT0);
  const [t, setT] = useState(defaultT);
  const [T, setTFinal] = useState(defaultTFinal);
  const [t2, setT2] = useState(defaultT2);
  const [contexto, setContexto] = useState(DEFAULT_CONTEXTO);
  const tmRef = useRef<HTMLInputElement>(null);
  const t0Ref = useRef<HTMLInputElement>(null);
  const tRef = useRef<HTMLInputElement>(null);
  const tFinalRef = useRef<HTMLInputElement>(null);
  const t2Ref = useRef<HTMLInputElement>(null);

  const [showEjercicios, setShowEjercicios] = useState(false);
  const [ejercicios, setEjercicios] = useState<NewtonEjercicio[]>(() => getRandomNewtonEjercicios(5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tm = parseFloat(Tm);
    const t0 = parseFloat(T0);
    const time = parseFloat(t);
    const tf = parseFloat(T);
    const time2 = parseFloat(t2);
    if (isNaN(tm) || isNaN(t0) || isNaN(time) || isNaN(tf) || isNaN(time2)) return;
    onSolve(tm, t0, time, tf, time2);
  };

  const selectEjercicio = (ej: NewtonEjercicio) => {
    setTm(ej.Tm);
    setT0(ej.T0);
    setT(ej.t);
    setTFinal(ej.T);
    setT2(ej.t2);
    setContexto(ej.contexto);
    setShowEjercicios(false);
  };

  const refreshEjercicios = () => {
    setEjercicios(getRandomNewtonEjercicios(5));
  };

  return (
    <form onSubmit={handleSubmit} className="equation-form">
      <h2>Ley de Enfriamiento de Newton</h2>
      <p className="form-subtitle">Modelo: dT/dt = k·(T - Tₘ)</p>

      <div className="problem-statement">
        <p>
          Haga clic en un valor del enunciado para editar el campo correspondiente:
        </p>
        <p className="statement-clickable">
          {contexto} La temperatura ambiente es{" "}
          <span className="clickable-value" onClick={() => tmRef.current?.focus()}>{Tm || "?"}</span>
          °C. Inicialmente está a{" "}
          <span className="clickable-value" onClick={() => t0Ref.current?.focus()}>{T0 || "?"}</span>
          °C y a los{" "}
          <span className="clickable-value" onClick={() => tRef.current?.focus()}>{t || "?"}</span>
          {" "}minutos está a{" "}
          <span className="clickable-value" onClick={() => tFinalRef.current?.focus()}>{T || "?"}</span>
          °C. a) Formule la ecuación diferencial. b) Halle la función T(t). c) Determine la temperatura en{" "}
          <span className="clickable-value" onClick={() => t2Ref.current?.focus()}>{t2 || "?"}</span>
          {" "}minutos.
        </p>
      </div>

      <div className="input-group">
         <label htmlFor="Tm">Temperatura ambiente en °C (Tₘ)</label>
        <input
          ref={tmRef}
          id="Tm"
          type="number"
          step="any"
          value={Tm}
          onChange={(e) => setTm(e.target.value)}
          placeholder="Ej: 25"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="T0">Temperatura inicial en °C (T₀)</label>
        <input
          ref={t0Ref}
          id="T0"
          type="number"
          step="any"
          value={T0}
          onChange={(e) => setT0(e.target.value)}
          placeholder="Ej: 100"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="t">Tiempo transcurrido en min (t)</label>
        <input
          ref={tRef}
          id="t"
          type="number"
          step="any"
          min="0"
          value={t}
          onChange={(e) => setT(e.target.value)}
          placeholder="Ej: 30"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="T">Temperatura final en °C T(t)</label>
        <input
          ref={tFinalRef}
          id="T"
          type="number"
          step="any"
          value={T}
          onChange={(e) => setTFinal(e.target.value)}
          placeholder="Ej: 50"
          required
        />
      </div>

      <div className="input-group">
         <label htmlFor="t2-newton-form">Tiempo a proyectar en min (t₂)</label>
        <input
          ref={t2Ref}
          id="t2-newton-form"
          type="number"
          step="any"
          min="0"
          value={t2}
          onChange={(e) => setT2(e.target.value)}
          placeholder="Ej: 60"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Calculando..." : "Calcular enfriamiento"}
      </button>

      <button type="button" className="exercises-btn" onClick={() => { setEjercicios(getRandomNewtonEjercicios(5)); setShowEjercicios(true); }}>
        Revisar ejercicios similares
      </button>

      {showEjercicios && (
        <div className="modal-overlay" onClick={() => setShowEjercicios(false)}>
          <div className="modal-content ejercicios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ejercicios de la Ley de Newton</h2>
              <button className="modal-close" onClick={() => setShowEjercicios(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="ejercicios-hint">Selecciona un ejercicio para cargar sus datos en el formulario:</p>
              <div className="ejercicios-list">
                {ejercicios.map((ej) => (
                  <button key={ej.id} className="ejercicio-card" onClick={() => selectEjercicio(ej)}>
                    <span className="ejercicio-id">#{ej.id}</span>
                    <span className="ejercicio-text">
                      {ej.contexto} Inicialmente está a {ej.T0}°C y a los {ej.t} minutos está a {ej.T}°C.
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
