import axios from "axios";
import type { PopulationGrowthRequest, PopulationGrowthResponse, RadioactiveDecayRequest, RadioactiveDecayResponse, C14DatingRequest, C14DatingResponse, NewtonCoolingRequest, NewtonCoolingResponse } from "../types/equation";

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "/api/v1").replace(/\/$/, "");

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

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
