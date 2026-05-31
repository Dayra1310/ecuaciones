import { useState, useRef } from "react";
import { getRandomC14Ejercicios } from "../data/c14Ejercicios";
import type { C14Ejercicio } from "../data/c14Ejercicios";

interface Props {
  onSolve: (N: number) => void;
  isLoading: boolean;
  defaultN?: string;
}

export function C14Form({ onSolve, isLoading, defaultN = "" }: Props) {
  const [N, setN] = useState(defaultN);
  const nRef = useRef<HTMLInputElement>(null);

  const [showEjercicios, setShowEjercicios] = useState(false);
  const [ejercicios, setEjercicios] = useState<C14Ejercicio[]>(() => getRandomC14Ejercicios(5));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(N);
    if (isNaN(n)) return;
    onSolve(n);
  };

  const selectEjercicio = (ej: C14Ejercicio) => {
    setN(ej.N);
    setShowEjercicios(false);
  };

  const refreshEjercicios = () => {
    setEjercicios(getRandomC14Ejercicios(5));
  };

  return (
    <form onSubmit={handleSubmit} className="equation-form">
      <h2>Datación por Carbono-14</h2>
      <p className="form-subtitle">Modelo: N = N₀ · (1/2)^(t/5730)</p>

      <div className="problem-statement">
        <p>
          Haga clic en un valor del enunciado para editar el campo correspondiente:
        </p>
        <p className="statement-clickable">
          Un fósil tiene hoy el{" "}
          <span className="clickable-value" onClick={() => nRef.current?.focus()}>{N || "?"}</span>
          % de ¹⁴C inicial. ¿Cuántos años han pasado?
        </p>
      </div>

      <div className="input-group">
        <label htmlFor="N">Concentración actual de ¹⁴C N(t)</label>
        <input
          ref={nRef}
          id="N"
          type="number"
          step="any"
          value={N}
          onChange={(e) => setN(e.target.value)}
          placeholder="Ej: 25"
          required
        />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Calculando..." : "Calcular edad"}
      </button>

      <button type="button" className="exercises-btn" onClick={() => { setEjercicios(getRandomC14Ejercicios(5)); setShowEjercicios(true); }}>
        Revisar ejercicios similares
      </button>

      {showEjercicios && (
        <div className="modal-overlay" onClick={() => setShowEjercicios(false)}>
          <div className="modal-content ejercicios-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ejercicios de Carbono-14</h2>
              <button className="modal-close" onClick={() => setShowEjercicios(false)}>×</button>
            </div>
            <div className="modal-body">
              <p className="ejercicios-hint">Selecciona un ejercicio para cargar sus datos en el formulario:</p>
              <div className="ejercicios-list">
                {ejercicios.map((ej) => (
                  <button key={ej.id} className="ejercicio-card" onClick={() => selectEjercicio(ej)}>
                    <span className="ejercicio-id">#{ej.id}</span>
                    <span className="ejercicio-text">
                      {ej.contexto}
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
