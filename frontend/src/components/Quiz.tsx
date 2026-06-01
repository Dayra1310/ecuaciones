import { useState } from "react";
import { generarQuiz } from "../data/quizEjercicios";
import { evaluateQuiz1 } from "../services/api";
import type { QuizExerciseParams, Quiz1ResultItem } from "../types/equation";
import type { QuizExercise } from "../data/quizEjercicios";

const TOLERANCIA = 0.05;

function casiIgual(a: number, b: number): boolean {
  if (b === 0) return Math.abs(a) < TOLERANCIA;
  return Math.abs((a - b) / b) < TOLERANCIA;
}

export function Quiz() {
  const [iniciado, setIniciado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [cantidad, setCantidad] = useState(5);
  const [preguntas, setPreguntas] = useState<QuizExercise[]>([]);
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState<{ k: string; proyeccion: string }[]>([]);
  const [resultados, setResultados] = useState<boolean[]>([]);
  const [mostrandoResultado, setMostrandoResultado] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const comenzar = async () => {
    const n = Math.max(1, Math.min(20, cantidad || 1));
    setCargando(true);

    const ejerciciosSeleccionados = generarQuiz(n);

    const params: QuizExerciseParams[] = ejerciciosSeleccionados.map((ex) => {
      const base: QuizExerciseParams = { tipo: ex.tipo };
      if (ex._params) Object.assign(base, ex._params);
      return base;
    });

    try {
      const response = await evaluateQuiz1({ exercises: params });
      const ejerciciosConRespuestas: QuizExercise[] = ejerciciosSeleccionados.map((ex, i) => {
        const res: Quiz1ResultItem = response.resultados[i];
        return {
          ...ex,
          k: res.k,
          valorProyectado: res.valorProyectado,
        };
      });
      setPreguntas(ejerciciosConRespuestas);
      setIniciado(true);
    } catch (err) {
      console.error("Error al evaluar quiz:", err);
      alert("Error al conectar con el servidor. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  if (!iniciado) {
    return (
      <div className="quiz-config">
        <h2>Evaluación 1</h2>
        <p className="quiz-config-desc">Ejercicios aleatorios de crecimiento, decaimiento, Newton y Carbono-14. Ingresa k y la proyección (o edad) para cada uno.</p>
        <div className="quiz-config-form">
          <label htmlFor="quiz1-cantidad">¿Cuántas preguntas quieres resolver?</label>
          <input
            id="quiz1-cantidad"
            type="number"
            min={1}
            max={20}
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          />
          <span className="quiz-config-hint">(1 a 20)</span>
        </div>
        <button className="quiz-btn primary" onClick={comenzar} disabled={cargando}>
          {cargando ? "Cargando..." : "Comenzar"}
        </button>
      </div>
    );
  }

  const pregunta = preguntas[actual];
  const respuestaActual = respuestas[actual] ?? { k: "", proyeccion: "" };

  const setRespuesta = (campo: "k" | "proyeccion", valor: string) => {
    const nuevas = [...respuestas];
    nuevas[actual] = { ...respuestaActual, [campo]: valor };
    setRespuestas(nuevas);
  };

  const verificar = () => {
    const kVal = parseFloat(respuestaActual.k);
    const proyVal = parseFloat(respuestaActual.proyeccion);
    if (isNaN(kVal) || isNaN(proyVal)) return;

    const ok = casiIgual(kVal, pregunta.k) && casiIgual(proyVal, pregunta.valorProyectado);
    const nuevos = [...resultados];
    nuevos[actual] = ok;
    setResultados(nuevos);
    setEnviado(true);
  };

  const siguiente = () => {
    setEnviado(false);
    if (actual < preguntas.length - 1) {
      setActual(actual + 1);
    } else {
      setMostrandoResultado(true);
    }
  };

  const puntaje = resultados.filter(Boolean).length;

  if (mostrandoResultado) {
    return (
      <div className="quiz-resultado">
        <h2>Evaluación completada</h2>
        <div className="quiz-nota">
          <span className={`nota-valor ${puntaje >= 3 ? "aprobado" : "reprobado"}`}>
            {puntaje}
          </span>
          <span className="nota-total">/ {preguntas.length}</span>
        </div>
        <p className="nota-descripcion">
          {puntaje >= preguntas.length - 1 ? "¡Excelente trabajo!" : puntaje >= Math.ceil(preguntas.length / 2) ? "Bien, puedes mejorar." : "Te recomendamos practicar más."}
        </p>
        <div className="quiz-detalle">
          {preguntas.map((pq, i) => {
            const ok = resultados[i];
            return (
              <div key={i} className={`quiz-detalle-item ${ok ? "correcto" : "incorrecto"}`}>
                <span className="quiz-detalle-num">#{i + 1}</span>
                <span className="quiz-detalle-texto">{pq.tipo === "crecimiento" ? "Crecimiento" : pq.tipo === "decaimiento" ? "Decaimiento" : pq.tipo === "c14" ? "Carbono-14" : "Newton"}</span>
                <span className="quiz-detalle-resultado">{ok ? "✓" : "✗"}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Evaluación 1</h2>
        <span className="quiz-progreso">Pregunta {actual + 1} de {preguntas.length}</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${((actual + 1) / preguntas.length) * 100}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-tipo-badge">{pregunta.tipo === "crecimiento" ? "Crecimiento" : pregunta.tipo === "decaimiento" ? "Decaimiento" : pregunta.tipo === "c14" ? "Carbono-14" : "Newton"}</div>
        <p className="quiz-enunciado">{pregunta.enunciado}</p>

        <div className="quiz-datos">
          {pregunta.datos.map((d, i) => (
            <span key={i} className="quiz-dato"><strong>{d.label}:</strong> {d.valor}</span>
          ))}
        </div>

        <div className="quiz-inputs">
          <div className="quiz-input-group">
            <label>Valor de k:</label>
            <input
              type="number"
              step="any"
              value={respuestaActual.k}
              onChange={(e) => setRespuesta("k", e.target.value)}
              placeholder="Ej: 0.0231"
              disabled={enviado}
            />
          </div>
          <div className="quiz-input-group">
            <label>{pregunta.tipo === "c14" ? "Edad (años)" : "Valor proyectado:"}</label>
            <input
              type="number"
              step="any"
              value={respuestaActual.proyeccion}
              onChange={(e) => setRespuesta("proyeccion", e.target.value)}
              placeholder={pregunta.tipo === "c14" ? "Ej: 11460" : "Ej: 1250.5"}
              disabled={enviado}
            />
          </div>
        </div>

        {enviado && (
          <div className={`quiz-feedback ${resultados[actual] ? "correcto" : "incorrecto"}`}>
            <p>
              {resultados[actual]
                ? "✓ ¡Correcto!"
                : `✗ Incorrecto. k ≈ ${pregunta.k.toFixed(5)}, ${pregunta.tipo === "c14" ? "edad" : "proyección"} ≈ ${pregunta.valorProyectado.toFixed(2)}`}
            </p>
          </div>
        )}
      </div>

      <div className="quiz-actions">
        {!enviado ? (
          <button className="quiz-btn primary" onClick={verificar} disabled={!respuestaActual.k || !respuestaActual.proyeccion}>
            Verificar
          </button>
        ) : (
          <button className="quiz-btn primary" onClick={siguiente}>
            {actual < preguntas.length - 1 ? "Siguiente" : "Ver resultado"}
          </button>
        )}
      </div>
    </div>
  );
}
