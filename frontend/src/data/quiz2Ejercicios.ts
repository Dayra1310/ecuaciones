import { crecimientoEjercicios } from "./crecimientoEjercicios";
import { decaimientoEjercicios } from "./decaimientoEjercicios";
import { newtonEjercicios } from "./newtonEjercicios";
import { c14Ejercicios } from "./c14Ejercicios";

export type Segmento =
  | { tipo: "texto"; contenido: string }
  | { tipo: "blank"; id: string; respuesta: string }
  | { tipo: "blank-num"; id: string; respuesta: number };

export interface PreguntaQuiz2 {
  tipo: "crecimiento" | "decaimiento" | "newton" | "c14";
  enunciado: string;
  ecuacion: string;
  formaEstandar: string;
  esLineal: boolean;
  orden: number;
  pasos: Segmento[][];
}

function getRandomFrom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function fmt(n: number): string {
  return Math.abs(n) < 0.0001 ? n.toExponential(4) : n.toFixed(5);
}

export function generarQuiz2(cantidad: number = 5): PreguntaQuiz2[] {
  const mezcla: { tipo: "crecimiento" | "decaimiento" | "newton" | "c14"; ej: any }[] = [
    ...crecimientoEjercicios.map((ej) => ({ tipo: "crecimiento" as const, ej })),
    ...decaimientoEjercicios.map((ej) => ({ tipo: "decaimiento" as const, ej })),
    ...newtonEjercicios.map((ej) => ({ tipo: "newton" as const, ej })),
    ...c14Ejercicios.map((ej) => ({ tipo: "c14" as const, ej })),
  ];

  return getRandomFrom(mezcla, cantidad).map(({ tipo, ej }) => {
    if (tipo === "crecimiento") {
      const P0 = parseFloat(ej.P0);
      const P = parseFloat(ej.P);
      const t = parseFloat(ej.t);
      const t2 = parseFloat(ej.t2);
      const k = Math.log(P / P0) / t;
      const proy = P0 * Math.exp(k * t2);
      return {
        tipo,
        enunciado: `${ej.contexto} Inicialmente hay ${ej.P0} ${ej.entidad} y después de ${ej.t} años hay ${ej.P}. Determine k y la ${ej.entidad === "habitantes" ? "población" : "cantidad"} al cabo de ${ej.t2} años.`,
        ecuacion: "dP/dt = k·P",
        formaEstandar: "dP/dt - k·P = 0",
        esLineal: true,
        orden: 1,
        pasos: [
          [
            { tipo: "texto", contenido: "Paso 1: Identificar el tipo de ecuación." },
          ],
          [
            { tipo: "texto", contenido: "Ecuación: dP/dt = k·P → forma estándar: dP/dt - k·P = 0" },
          ],
          [
            { tipo: "texto", contenido: "¿Es lineal? " },
            { tipo: "blank", id: "lineal", respuesta: "sí" },
          ],
          [
            { tipo: "texto", contenido: "Orden de la ecuación: " },
            { tipo: "blank-num", id: "orden", respuesta: 1 },
          ],
          [
            { tipo: "texto", contenido: "Paso 2: Separar variables." },
          ],
          [
            { tipo: "texto", contenido: "dP/P = k·dt" },
          ],
          [
            { tipo: "texto", contenido: "Paso 3: Integrar ambos lados." },
          ],
          [
            { tipo: "texto", contenido: "∫ dP/P = ∫ k·dt → ln|P| = k·t + C" },
          ],
          [
            { tipo: "texto", contenido: "Paso 4: Despejar P(t)." },
          ],
          [
            { tipo: "texto", contenido: "P(t) = C·e^{k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 5: Aplicar condición inicial P(0) = " },
            { tipo: "blank-num", id: "P0", respuesta: P0 },
            { tipo: "texto", contenido: "." },
          ],
          [
            { tipo: "texto", contenido: "C = " },
            { tipo: "blank-num", id: "C", respuesta: P0 },
          ],
          [
            { tipo: "texto", contenido: "Solución particular: P(t) = " },
            { tipo: "blank-num", id: "P0_sol", respuesta: P0 },
            { tipo: "texto", contenido: "·e^{k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 6: Hallar k usando P(" },
            { tipo: "blank-num", id: "t_val", respuesta: t },
            { tipo: "texto", contenido: ") = " },
            { tipo: "blank-num", id: "P_val", respuesta: P },
          ],
          [
            { tipo: "texto", contenido: "k = ln(P/P₀)/t = ln(" },
            { tipo: "blank-num", id: "P_ln", respuesta: P },
            { tipo: "texto", contenido: "/" },
            { tipo: "blank-num", id: "P0_ln", respuesta: P0 },
            { tipo: "texto", contenido: ")/" },
            { tipo: "blank-num", id: "t_ln", respuesta: t },
            { tipo: "texto", contenido: " = " },
            { tipo: "blank", id: "k_val", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "k ≈ " },
            { tipo: "blank", id: "k_aprox", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "Paso 7: Proyectar en t₂ = " },
            { tipo: "blank-num", id: "t2_val", respuesta: t2 },
            { tipo: "texto", contenido: "." },
          ],
          [
            { tipo: "texto", contenido: "P(t₂) = " },
            { tipo: "blank-num", id: "proy_val", respuesta: proy },
          ],
        ],
      };
    }

    if (tipo === "decaimiento") {
      const A1 = parseFloat(ej.A1);
      const A2 = parseFloat(ej.A2);
      const t = parseFloat(ej.t);
      const t2 = parseFloat(ej.t2);
      const k = Math.log(A1 / A2) / t;
      const proy = A1 * Math.exp(-k * t2);
      return {
        tipo,
        enunciado: `${ej.contexto} Inicialmente hay ${ej.A1} ${ej.entidad} y después de ${ej.t} horas quedan ${ej.A2} ${ej.entidad}. Determine k y la cantidad restante al cabo de ${ej.t2} horas.`,
        ecuacion: "dA/dt = -k·A",
        formaEstandar: "dA/dt + k·A = 0",
        esLineal: true,
        orden: 1,
        pasos: [
          [
            { tipo: "texto", contenido: "Paso 1: Identificar el tipo de ecuación." },
          ],
          [
            { tipo: "texto", contenido: "Ecuación: dA/dt = -k·A → forma estándar: dA/dt + k·A = 0" },
          ],
          [
            { tipo: "texto", contenido: "¿Es lineal? " },
            { tipo: "blank", id: "lineal", respuesta: "sí" },
          ],
          [
            { tipo: "texto", contenido: "Orden de la ecuación: " },
            { tipo: "blank-num", id: "orden", respuesta: 1 },
          ],
          [
            { tipo: "texto", contenido: "Paso 2: Separar variables." },
          ],
          [
            { tipo: "texto", contenido: "dA/A = -k·dt" },
          ],
          [
            { tipo: "texto", contenido: "Paso 3: Integrar ambos lados." },
          ],
          [
            { tipo: "texto", contenido: "∫ dA/A = -∫ k·dt → ln|A| = -k·t + C" },
          ],
          [
            { tipo: "texto", contenido: "Paso 4: Despejar A(t)." },
          ],
          [
            { tipo: "texto", contenido: "A(t) = C·e^{-k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 5: Aplicar condición inicial A(0) = " },
            { tipo: "blank-num", id: "A1", respuesta: A1 },
            { tipo: "texto", contenido: "." },
          ],
          [
            { tipo: "texto", contenido: "C = " },
            { tipo: "blank-num", id: "C", respuesta: A1 },
          ],
          [
            { tipo: "texto", contenido: "Solución particular: A(t) = " },
            { tipo: "blank-num", id: "A1_sol", respuesta: A1 },
            { tipo: "texto", contenido: "·e^{-k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 6: Hallar k usando A(" },
            { tipo: "blank-num", id: "t_val", respuesta: t },
            { tipo: "texto", contenido: ") = " },
            { tipo: "blank-num", id: "A2_val", respuesta: A2 },
          ],
          [
            { tipo: "texto", contenido: "k = ln(A₁/A₂)/t = ln(" },
            { tipo: "blank-num", id: "A1_ln", respuesta: A1 },
            { tipo: "texto", contenido: "/" },
            { tipo: "blank-num", id: "A2_ln", respuesta: A2 },
            { tipo: "texto", contenido: ")/" },
            { tipo: "blank-num", id: "t_ln", respuesta: t },
            { tipo: "texto", contenido: " = " },
            { tipo: "blank", id: "k_val", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "k ≈ " },
            { tipo: "blank", id: "k_aprox", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "Paso 7: Proyectar en t₂ = " },
            { tipo: "blank-num", id: "t2_val", respuesta: t2 },
            { tipo: "texto", contenido: "." },
          ],
          [
            { tipo: "texto", contenido: "A(t₂) ≈ " },
            { tipo: "blank-num", id: "proy_val", respuesta: proy },
          ],
        ],
      };
    }

    if (tipo === "c14") {
      const N = parseFloat(ej.N);
      const k = Math.LN2 / 5730;
      const age = -Math.log(N / 100) / k;
      return {
        tipo,
        enunciado: ej.contexto,
        ecuacion: "dN/dt = -k·N",
        formaEstandar: "dN/dt + k·N = 0",
        esLineal: true,
        orden: 1,
        pasos: [
          [
            { tipo: "texto", contenido: "Paso 1: Identificar el tipo de ecuación." },
          ],
          [
            { tipo: "texto", contenido: "Ecuación: dN/dt = -k·N → forma estándar: dN/dt + k·N = 0" },
          ],
          [
            { tipo: "texto", contenido: "¿Es lineal? " },
            { tipo: "blank", id: "lineal", respuesta: "sí" },
          ],
          [
            { tipo: "texto", contenido: "Orden de la ecuación: " },
            { tipo: "blank-num", id: "orden", respuesta: 1 },
          ],
          [
            { tipo: "texto", contenido: "Paso 2: Separar variables." },
          ],
          [
            { tipo: "texto", contenido: "dN/N = -k·dt" },
          ],
          [
            { tipo: "texto", contenido: "Paso 3: Integrar ambos lados." },
          ],
          [
            { tipo: "texto", contenido: "∫ dN/N = -∫ k·dt → ln|N| = -k·t + C" },
          ],
          [
            { tipo: "texto", contenido: "Aplicamos exponencial: e^(ln|N|) = e^(-k·t + C)" },
          ],
          [
            { tipo: "texto", contenido: "Paso 4: Despejar N(t)." },
          ],
          [
            { tipo: "texto", contenido: "N(t) = C·e^{-k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 5: Aplicar condición inicial N(0) = " },
            { tipo: "blank-num", id: "N0", respuesta: 100 },
            { tipo: "texto", contenido: "." },
          ],
          [
            { tipo: "texto", contenido: "C = " },
            { tipo: "blank-num", id: "C", respuesta: 100 },
          ],
          [
            { tipo: "texto", contenido: "Solución particular: N(t) = " },
            { tipo: "blank-num", id: "N0_sol", respuesta: 100 },
            { tipo: "texto", contenido: "·e^{-k·t}" },
          ],
          [
            { tipo: "texto", contenido: "Paso 6: Hallar k usando la vida media (5730 años):" },
          ],
          [
            { tipo: "texto", contenido: "N(5730) = N₀/2 → 100·e^{-k·5730} = 50" },
          ],
          [
            { tipo: "texto", contenido: "e^{-k·5730} = 1/2 → -k·5730 = ln(1/2)" },
          ],
          [
            { tipo: "texto", contenido: "k = ln|2| / 5730 = " },
            { tipo: "blank", id: "k_val", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "k ≈ " },
            { tipo: "blank", id: "k_aprox", respuesta: fmt(k) },
          ],
          [
            { tipo: "texto", contenido: "Paso 7: Determinar la edad de la muestra con " },
            { tipo: "blank-num", id: "N_act", respuesta: N },
            { tipo: "texto", contenido: "% de ¹⁴C:" },
          ],
          [
            { tipo: "texto", contenido: "N(t) = 100·(1/2)^(t/5730)" },
          ],
          [
            { tipo: "texto", contenido: "Despejamos t:" },
          ],
          [
            { tipo: "texto", contenido: "t = " },
            { tipo: "blank-num", id: "edad", respuesta: age },
          ],
        ],
      };
    }

    // Newton
    const Tm = parseFloat(ej.Tm);
    const T0 = parseFloat(ej.T0);
    const t = parseFloat(ej.t);
    const T = parseFloat(ej.T);
    const t2 = parseFloat(ej.t2);
    const k = Math.log((T - Tm) / (T0 - Tm)) / t;
    const proy = Tm + (T0 - Tm) * Math.exp(k * t2);
    return {
      tipo,
      enunciado: `${ej.contexto} Inicialmente está a ${ej.T0}°C y a los ${ej.t} minutos está a ${ej.T}°C con Tₘ = ${ej.Tm}°C. Determine k y la temperatura al cabo de ${ej.t2} minutos.`,
      ecuacion: "dT/dt = k·(T - Tₘ)",
      formaEstandar: "dT/dt - k·T = -k·Tₘ",
      esLineal: true,
      orden: 1,
      pasos: [
        [
          { tipo: "texto", contenido: "Paso 1: Identificar el tipo de ecuación." },
        ],
        [
          { tipo: "texto", contenido: "Ecuación: dT/dt = k·(T - Tₘ) → forma estándar: dT/dt - k·T = -k·Tₘ" },
        ],
        [
          { tipo: "texto", contenido: "¿Es lineal? " },
          { tipo: "blank", id: "lineal", respuesta: "sí" },
        ],
        [
          { tipo: "texto", contenido: "Orden de la ecuación: " },
          { tipo: "blank-num", id: "orden", respuesta: 1 },
        ],
        [
          { tipo: "texto", contenido: "Paso 2: Separar variables (ecuación homogénea asociada)." },
        ],
        [
          { tipo: "texto", contenido: "dT/(T - Tₘ) = k·dt" },
        ],
        [
          { tipo: "texto", contenido: "Paso 3: Integrar ambos lados." },
        ],
        [
          { tipo: "texto", contenido: "∫ dT/(T - Tₘ) = ∫ k·dt → ln|T - Tₘ| = k·t + C" },
        ],
        [
          { tipo: "texto", contenido: "Paso 4: Despejar T(t)." },
        ],
        [
          { tipo: "texto", contenido: "T(t) = Tₘ + C·e^{k·t}" },
        ],
        [
          { tipo: "texto", contenido: "Paso 5: Aplicar condición inicial T(0) = " },
          { tipo: "blank-num", id: "T0", respuesta: T0 },
          { tipo: "texto", contenido: "." },
        ],
        [
          { tipo: "texto", contenido: "C = T₀ - Tₘ = " },
          { tipo: "blank-num", id: "C_val", respuesta: T0 - Tm },
        ],
        [
          { tipo: "texto", contenido: "Solución particular: T(t) = " },
          { tipo: "blank-num", id: "Tm_sol", respuesta: Tm },
          { tipo: "texto", contenido: " + " },
          { tipo: "blank-num", id: "C_sol", respuesta: T0 - Tm },
          { tipo: "texto", contenido: "·e^{k·t}" },
        ],
        [
          { tipo: "texto", contenido: "Paso 6: Hallar k usando T(" },
          { tipo: "blank-num", id: "t_val", respuesta: t },
          { tipo: "texto", contenido: ") = " },
          { tipo: "blank-num", id: "T_val", respuesta: T },
        ],
        [
          { tipo: "texto", contenido: "k = ln((T - Tₘ)/(T₀ - Tₘ))/t = ln((" },
          { tipo: "blank-num", id: "T_num", respuesta: T },
          { tipo: "texto", contenido: " - " },
          { tipo: "blank-num", id: "Tm_num", respuesta: Tm },
          { tipo: "texto", contenido: ")/(" },
          { tipo: "blank-num", id: "T0_num", respuesta: T0 },
          { tipo: "texto", contenido: " - " },
          { tipo: "blank-num", id: "Tm_num2", respuesta: Tm },
          { tipo: "texto", contenido: "))/" },
          { tipo: "blank-num", id: "t_den", respuesta: t },
          { tipo: "texto", contenido: " = " },
          { tipo: "blank", id: "k_val", respuesta: fmt(k) },
        ],
        [
          { tipo: "texto", contenido: "k ≈ " },
          { tipo: "blank", id: "k_aprox", respuesta: fmt(k) },
        ],
        [
          { tipo: "texto", contenido: "Paso 7: Proyectar en t₂ = " },
          { tipo: "blank-num", id: "t2_val", respuesta: t2 },
          { tipo: "texto", contenido: "." },
        ],
        [
          { tipo: "texto", contenido: "T(t₂) ≈ " },
          { tipo: "blank-num", id: "proy_val", respuesta: proy },
        ],
      ],
    };
  });
}
