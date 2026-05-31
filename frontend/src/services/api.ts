import axios from "axios";
import type { EquationRequest, EquationResponse, PopulationGrowthRequest, PopulationGrowthResponse, RadioactiveDecayRequest, RadioactiveDecayResponse, C14DatingRequest, C14DatingResponse, NewtonCoolingRequest, NewtonCoolingResponse } from "../types/equation";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

export async function solveEquation(data: EquationRequest): Promise<EquationResponse> {
  const res = await api.post<EquationResponse>("/equations/solve", data);
  return res.data;
}

export async function validateExpression(expression: string): Promise<boolean> {
  const res = await api.post<{ valid: boolean }>("/equations/validate", { expression });
  return res.data.valid;
}

export async function solvePopulationGrowth(data: PopulationGrowthRequest): Promise<PopulationGrowthResponse> {
  const res = await api.post<PopulationGrowthResponse>("/equations/population-growth", data);
  return res.data;
}

export async function solveRadioactiveDecay(data: RadioactiveDecayRequest): Promise<RadioactiveDecayResponse> {
  const res = await api.post<RadioactiveDecayResponse>("/equations/radioactive-decay", data);
  return res.data;
}

export async function solveC14Dating(data: C14DatingRequest): Promise<C14DatingResponse> {
  const res = await api.post<C14DatingResponse>("/equations/c14-dating", data);
  return res.data;
}

export async function solveNewtonCooling(data: NewtonCoolingRequest): Promise<NewtonCoolingResponse> {
  const res = await api.post<NewtonCoolingResponse>("/equations/newton-cooling", data);
  return res.data;
}
