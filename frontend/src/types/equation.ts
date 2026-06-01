export interface StepDetail {
  title: string;
  substeps: string[];
}

export interface PopulationGrowthRequest {
  P0: number;
  P: number;
  t: number;
}

export interface PopulationGrowthResponse {
  k: number;
  solution: string;
  steps: StepDetail[];
}

export interface RadioactiveDecayRequest {
  A1: number;
  A2: number;
  t: number;
}

export interface RadioactiveDecayResponse {
  k: number;
  half_life: number;
  solution: string;
  steps: StepDetail[];
}

export interface C14DatingRequest {
  N0: number;
  N: number;
}

export interface C14DatingResponse {
  k: number;
  age: number;
  solution: string;
  steps: StepDetail[];
}

export interface NewtonCoolingRequest {
  Tm: number;
  T0: number;
  t: number;
  T: number;
}

export interface NewtonCoolingResponse {
  k: number;
  solution: string;
  steps: StepDetail[];
}

export interface QuizExerciseParams {
  tipo: string;
  P0?: number;
  P?: number;
  A1?: number;
  A2?: number;
  N?: number;
  Tm?: number;
  T0?: number;
  T?: number;
  t?: number;
  t2?: number;
}

export interface Quiz1ResultItem {
  k: number;
  valorProyectado: number;
}

export interface Quiz1Request {
  exercises: QuizExerciseParams[];
}

export interface Quiz1Response {
  resultados: Quiz1ResultItem[];
}

export interface Quiz2Blank {
  id: string;
  respuesta: number | string;
}

export interface Quiz2Response {
  blanks: Quiz2Blank[];
}
