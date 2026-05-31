import { crecimientoEjercicios } from "./crecimientoEjercicios";
import { decaimientoEjercicios } from "./decaimientoEjercicios";
import { newtonEjercicios } from "./newtonEjercicios";
import { c14Ejercicios } from "./c14Ejercicios";

export interface QuizExercise {
  tipo: "crecimiento" | "decaimiento" | "newton" | "c14";
  enunciado: string;
  k: number;
  valorProyectado: number;
  datos: { label: string; valor: string }[];
}

function computeCrecimiento(P0: number, P: number, t: number, t2: number): { k: number; proyeccion: number } {
  const k = Math.log(P / P0) / t;
  return { k, proyeccion: P0 * Math.exp(k * t2) };
}

function computeDecaimiento(A1: number, A2: number, t: number, t2: number): { k: number; proyeccion: number } {
  const k = Math.log(A1 / A2) / t;
  return { k, proyeccion: A1 * Math.exp(-k * t2) };
}

function computeNewton(Tm: number, T0: number, t: number, T: number, t2: number): { k: number; proyeccion: number } {
  const k = Math.log((T - Tm) / (T0 - Tm)) / t;
  return { k, proyeccion: Tm + (T0 - Tm) * Math.exp(k * t2) };
}

function computeC14(N: number): { k: number; proyeccion: number } {
  const k = Math.LN2 / 5730;
  const age = -Math.log(N / 100) / k;
  return { k, proyeccion: age };
}

function getRandomFrom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function generarQuiz(cantidad: number = 5): QuizExercise[] {
  const todos: { tipo: "crecimiento" | "decaimiento" | "newton" | "c14"; ej: any }[] = [
    ...crecimientoEjercicios.map((ej) => ({ tipo: "crecimiento" as const, ej })),
    ...decaimientoEjercicios.map((ej) => ({ tipo: "decaimiento" as const, ej })),
    ...newtonEjercicios.map((ej) => ({ tipo: "newton" as const, ej })),
    ...c14Ejercicios.map((ej) => ({ tipo: "c14" as const, ej })),
  ];

  const seleccionados = getRandomFrom(todos, cantidad);

  return seleccionados.map(({ tipo, ej }) => {
    let k: number;
    let proyeccion: number;
    let enunciado: string;
    let datos: { label: string; valor: string }[];

    if (tipo === "crecimiento") {
      const P0 = parseFloat(ej.P0);
      const P = parseFloat(ej.P);
      const t = parseFloat(ej.t);
      const t2 = parseFloat(ej.t2);
      const res = computeCrecimiento(P0, P, t, t2);
      k = res.k;
      proyeccion = res.proyeccion;
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
      const res = computeDecaimiento(A1, A2, t, t2);
      k = res.k;
      proyeccion = res.proyeccion;
      datos = [
        { label: "Cantidad inicial (A₀)", valor: ej.A1 + " " + ej.entidad },
        { label: "Tiempo (t)", valor: ej.t + " horas" },
        { label: "Cantidad restante A(t)", valor: ej.A2 + " " + ej.entidad },
      ];
      enunciado = `${ej.contexto} Inicialmente hay ${ej.A1} ${ej.entidad} y después de ${ej.t} horas quedan ${ej.A2} ${ej.entidad}. a) Encuentre la constante k. b) Calcule la cantidad restante al cabo de ${ej.t2} horas.`;
    } else if (tipo === "c14") {
      const N = parseFloat(ej.N);
      const res = computeC14(N);
      k = res.k;
      proyeccion = res.proyeccion;
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
      const res = computeNewton(Tm, T0, t, T, t2);
      k = res.k;
      proyeccion = res.proyeccion;
      datos = [
        { label: "Temperatura ambiente (Tₘ)", valor: ej.Tm + " °C" },
        { label: "Temperatura inicial (T₀)", valor: ej.T0 + " °C" },
        { label: "Tiempo (t)", valor: ej.t + " min" },
        { label: "Temperatura final T(t)", valor: ej.T + " °C" },
        { label: "Tiempo a proyectar (t₂)", valor: ej.t2 + " min" },
      ];
      enunciado = `${ej.contexto} Inicialmente está a ${ej.T0}°C y a los ${ej.t} minutos está a ${ej.T}°C. a) Encuentre la constante k. b) Calcule la temperatura al cabo de ${ej.t2} minutos.`;
    }

    return { tipo, enunciado, k, valorProyectado: proyeccion, datos };
  });
}
