export interface StepDetail {
  title: string;
  substeps: string[];
}

export interface EquationRequest {
  M: string;
  N: string;
  variable?: string;
}

export interface EquationResponse {
  exact: boolean;
  solution: string | null;
  integrating_factor: string | null;
  method: string | null;
  steps: StepDetail[];
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
