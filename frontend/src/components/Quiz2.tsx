import { useState } from "react";
import { generarQuiz2, type PreguntaQuiz2 } from "../data/quiz2Ejercicios";

const TOL = 0.01;

function casiIgualNum(a: number, b: number): boolean {
  if (b === 0) return Math.abs(a) < TOL;
  return Math.abs((a - b) / b) < TOL;
}

function normalizar(s: string): string {
  return s.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function Quiz2() {
  const [iniciado, setIniciado] = useState(false);
  const [cantidad, setCantidad] = useState(5);
  const [preguntas, setPreguntas] = useState<PreguntaQuiz2[]>([]);
  const [actual, setActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [resultados, setResultados] = useState<Record<string, boolean>>({});
  const [enviados, setEnviados] = useState<Record<number, boolean>>({});
  const [mostrandoResultado, setMostrandoResultado] = useState(false);

  const comenzar = () => {
    const n = Math.max(1, Math.min(20, cantidad || 1));
    setPreguntas(generarQuiz2(n));
    setIniciado(true);
  };

  if (!iniciado) {
    return (
      <div className="quiz-config">
        <h2>Evaluación 2 — Paso a paso</h2>
        <p className="quiz-config-desc">Identifica el tipo de ecuación, el orden y completa los espacios en blanco del proceso de solución.</p>
        <div className="quiz-config-form">
          <label htmlFor="quiz2-cantidad">¿Cuántas preguntas quieres resolver?</label>
          <input
            id="quiz2-cantidad"
            type="number"
            min={1}
            max={20}
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
          />
          <span className="quiz-config-hint">(1 a 20)</span>
        </div>
        <button className="quiz-btn primary" onClick={comenzar}>
          Comenzar
        </button>
      </div>
    );
  }

  const pregunta = preguntas[actual];

  const setResp = (id: string, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [`${actual}-${id}`]: valor }));
  };

  const getResp = (id: string): string => {
    return respuestas[`${actual}-${id}`] ?? "";
  };

  const verificar = () => {
    const nuevosResultados = { ...resultados };

    for (const paso of pregunta.pasos) {
      for (const seg of paso) {
        if (seg.tipo === "blank" || seg.tipo === "blank-num") {
          const valor = getResp(seg.id);
          if (seg.tipo === "blank") {
            nuevosResultados[`${actual}-${seg.id}`] =
              normalizar(valor) === normalizar(seg.respuesta);
          } else {
            const num = parseFloat(valor);
            nuevosResultados[`${actual}-${seg.id}`] =
              !isNaN(num) && casiIgualNum(num, seg.respuesta);
          }
        }
      }
    }

    setResultados(nuevosResultados);
    setEnviados((prev) => ({ ...prev, [actual]: true }));
  };

  const siguiente = () => {
    if (actual < preguntas.length - 1) {
      setActual(actual + 1);
    } else {
      setMostrandoResultado(true);
    }
  };

  const contarAciertos = (): number => {
    return Object.values(resultados).filter(Boolean).length;
  };

  const contarTotal = (): number => {
    let total = 0;
    for (const pq of preguntas) {
      for (const paso of pq.pasos) {
        for (const seg of paso) {
          if (seg.tipo === "blank" || seg.tipo === "blank-num") total++;
        }
      }
    }
    return total;
  };

  const aciertos = contarAciertos();
  const totalBlanks = contarTotal();
  const nota = totalBlanks > 0 ? (aciertos / totalBlanks) * 5 : 0;

  if (mostrandoResultado) {
    return (
      <div className="quiz-resultado">
        <h2>Evaluación completada</h2>
        <div className="quiz-nota">
          <span className={`nota-valor ${nota >= 3 ? "aprobado" : "reprobado"}`}>
            {nota.toFixed(1)}
          </span>
          <span className="nota-total">/ 5</span>
        </div>
        <p className="nota-descripcion">
          {aciertos} de {totalBlanks} respuestas correctas
        </p>
        <p className="nota-descripcion">
          {nota >= 4 ? "¡Excelente trabajo!" : nota >= 3 ? "Bien, puedes mejorar." : "Te recomendamos practicar más."}
        </p>
        <div className="quiz-detalle">
          {preguntas.map((pq, i) => (
            <div key={i} className="quiz-detalle-item quiz-detalle-pregunta">
              <span className="quiz-detalle-num">#{i + 1}</span>
              <span className="quiz-detalle-texto">{pq.tipo === "crecimiento" ? "Crecimiento" : pq.tipo === "decaimiento" ? "Decaimiento" : pq.tipo === "c14" ? "Carbono-14" : "Newton"}</span>
              <span className="quiz-detalle-sub">
                {Object.keys(resultados)
                  .filter((k) => k.startsWith(`${i}-`))
                  .filter((k) => k.endsWith("-k_aprox"))
                  .map((k) => (resultados[k] ? "✓ k" : "✗ k"))
                  .join(", ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const enviado = enviados[actual];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Evaluación 2 — Paso a paso</h2>
        <span className="quiz-progreso">Pregunta {actual + 1} de {preguntas.length}</span>
      </div>

      <div className="quiz-progress-bar">
        <div className="quiz-progress-fill" style={{ width: `${((actual + 1) / preguntas.length) * 100}%` }} />
      </div>

      <div className="quiz-card">
        <div className="quiz-tipo-badge">{pregunta.tipo === "crecimiento" ? "Crecimiento" : pregunta.tipo === "decaimiento" ? "Decaimiento" : pregunta.tipo === "c14" ? "Carbono-14" : "Newton"}</div>
        <p className="quiz-enunciado">{pregunta.enunciado}</p>

        <div className="quiz2-ecuacion">
          <strong>Ecuación:</strong> {pregunta.ecuacion}
          <br />
          <strong>Forma estándar:</strong> {pregunta.formaEstandar}
        </div>

        <div className="quiz2-pasos">
          {pregunta.pasos.map((paso, pi) => (
            <div key={pi} className="quiz2-paso">
              {paso.map((seg, si) => {
                if (seg.tipo === "texto") {
                  return <span key={si} className="quiz2-texto">{seg.contenido}</span>;
                }
                if (seg.tipo === "blank" || seg.tipo === "blank-num") {
                  const id = seg.id;
                  const val = getResp(id);
                  const res = resultados[`${actual}-${id}`];
                  const mostrarResultado = enviado && res !== undefined;

                  if (id === "lineal") {
                    return (
                      <span key={si} className="quiz2-blank-wrap">
                        <select
                          className={`quiz2-blank quiz2-select ${mostrarResultado ? (res ? "correcto" : "incorrecto") : ""}`}
                          value={val}
                          onChange={(e) => setResp(id, e.target.value)}
                          disabled={enviado}
                        >
                          <option value="">—</option>
                          <option value="sí">Sí</option>
                          <option value="no">No</option>
                        </select>
                        {mostrarResultado && (
                          <span className="quiz2-respuesta">
                            {res ? "✓" : seg.respuesta}
                          </span>
                        )}
                      </span>
                    );
                  }

                  return (
                    <span key={si} className="quiz2-blank-wrap">
                      <input
                        type={seg.tipo === "blank-num" ? "number" : "text"}
                        className={`quiz2-blank ${mostrarResultado ? (res ? "correcto" : "incorrecto") : ""}`}
                        value={val}
                        onChange={(e) => setResp(id, e.target.value)}
                        disabled={enviado}
                        placeholder={seg.tipo === "blank" ? "texto" : "número"}
                        step={seg.tipo === "blank-num" ? "any" : undefined}
                      />
                      {mostrarResultado && (
                        <span className="quiz2-respuesta">
                          {res ? "✓" : seg.respuesta}
                        </span>
                      )}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-actions">
        {!enviado ? (
          <button className="quiz-btn primary" onClick={verificar}>
            Verificar respuestas
          </button>
        ) : (
          <button className="quiz-btn primary" onClick={siguiente}>
            {actual < preguntas.length - 1 ? "Siguiente pregunta" : "Ver resultado final"}
          </button>
        )}
      </div>
    </div>
  );
}
