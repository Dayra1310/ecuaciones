import { useMutation } from "@tanstack/react-query";
import { solveNewtonCooling } from "../services/api";
import type { NewtonCoolingRequest, NewtonCoolingResponse } from "../types/equation";

export function useNewtonCooling() {
  return useMutation<NewtonCoolingResponse, Error, NewtonCoolingRequest>({
    mutationFn: solveNewtonCooling,
  });
}
