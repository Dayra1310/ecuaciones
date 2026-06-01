import { crecimientoEjercicios, type CrecimientoEjercicio } from "./crecimientoEjercicios";
import { decaimientoEjercicios, type DecaimientoEjercicio } from "./decaimientoEjercicios";
import { newtonEjercicios, type NewtonEjercicio } from "./newtonEjercicios";
import { c14Ejercicios, type C14Ejercicio } from "./c14Ejercicios";

export interface QuizExercise {
  tipo: "crecimiento" | "decaimiento" | "newton" | "c14";
  enunciado: string;
  k: number;
  valorProyectado: number;
  datos: { label: string; valor: string }[];
  _params?: Record<string, number | undefined>;
}

type QuizSource =
  | { tipo: "crecimiento"; ej: CrecimientoEjercicio }
  | { tipo: "decaimiento"; ej: DecaimientoEjercicio }
  | { tipo: "newton"; ej: NewtonEjercicio }
  | { tipo: "c14"; ej: C14Ejercicio };

function getRandomFrom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generarQuiz(cantidad: number = 5): QuizExercise[] {
  const todos: QuizSource[] = [
    ...crecimientoEjercicios.map((ej) => ({ tipo: "crecimiento" as const, ej })),
    ...decaimientoEjercicios.map((ej) => ({ tipo: "decaimiento" as const, ej })),
    ...newtonEjercicios.map((ej) => ({ tipo: "newton" as const, ej })),
    ...c14Ejercicios.map((ej) => ({ tipo: "c14" as const, ej })),
  ];

  const seleccionados = getRandomFrom(todos, cantidad);

  return seleccionados.map(({ tipo, ej }) => {
    let enunciado: string;
    let datos: { label: string; valor: string }[];
    let params: Record<string, number | undefined>;

    if (tipo === "crecimiento") {
      const P0 = parseFloat(ej.P0);
      const P = parseFloat(ej.P);
      const t = parseFloat(ej.t);
      const t2 = parseFloat(ej.t2);
      params = { P0, P, t, t2 };
      datos = [
        { label: "Población inicial (P₀)", valor: ej.P0 },
        { label: "Tiempo (t)", valor: ej.t + " años" },
        { label: "Población final P(t)", valor: ej.P },
        { label: "Tiempo a proyectar (t₂)", valor: ej.t2 + " años" },
      ];
      enunciado = `${ej.contexto} Inicialmente hay ${ej.P0} ${ej.entidad} y después de ${ej.t} años hay ${ej.P}. a) Encuentre la constante k. b) Calcule la ${ej.entidad === "habitantes" ? "población" : "cantidad"} al cabo de ${ej.t2} años.`;
    } else if (tipo === "decaimiento") {
      const A1 = parseFloat(ej.A1);
      const A2 = parseFloat(ej.A2);
      const t = parseFloat(ej.t);
      const t2 = parseFloat(ej.t2);
      params = { A1, A2, t, t2 };
      datos = [
        { label: "Cantidad inicial (A₀)", valor: ej.A1 + " " + ej.entidad },
        { label: "Tiempo (t)", valor: ej.t + " horas" },
        { label: "Cantidad restante A(t)", valor: ej.A2 + " " + ej.entidad },
      ];
      enunciado = `${ej.contexto} Inicialmente hay ${ej.A1} ${ej.entidad} y después de ${ej.t} horas quedan ${ej.A2} ${ej.entidad}. a) Encuentre la constante k. b) Calcule la cantidad restante al cabo de ${ej.t2} horas.`;
    } else if (tipo === "c14") {
      const N = parseFloat(ej.N);
      params = { N };
      datos = [
        { label: "Concentración actual (N)", valor: ej.N + "%" },
      ];
      enunciado = ej.contexto;
    } else {
      const Tm = parseFloat(ej.Tm);
      const T0 = parseFloat(ej.T0);
      const t = parseFloat(ej.t);
      const T = parseFloat(ej.T);
      const t2 = parseFloat(ej.t2);
      params = { Tm, T0, t, T, t2 };
      datos = [
        { label: "Temperatura ambiente (Tₘ)", valor: ej.Tm + " °C" },
        { label: "Temperatura inicial (T₀)", valor: ej.T0 + " °C" },
        { label: "Tiempo (t)", valor: ej.t + " min" },
        { label: "Temperatura final T(t)", valor: ej.T + " °C" },
        { label: "Tiempo a proyectar (t₂)", valor: ej.t2 + " min" },
      ];
      enunciado = `${ej.contexto} Inicialmente está a ${ej.T0}°C y a los ${ej.t} minutos está a ${ej.T}°C. a) Encuentre la constante k. b) Calcule la temperatura al cabo de ${ej.t2} minutos.`;
    }

    return { tipo, enunciado, k: 0, valorProyectado: 0, datos, _params: params };
  });
}
