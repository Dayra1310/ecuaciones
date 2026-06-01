import { useMutation } from "@tanstack/react-query";
import { solveNewtonCooling } from "../services/api";
import type { NewtonCoolingRequest, NewtonCoolingResponse } from "../types/equation";
import type { AxiosError } from "axios";

export function useNewtonCooling() {
  return useMutation<NewtonCoolingResponse, AxiosError, NewtonCoolingRequest>({
    mutationFn: solveNewtonCooling,
  });
}
