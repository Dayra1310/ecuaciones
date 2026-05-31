import { useMutation } from "@tanstack/react-query";
import { solveEquation } from "../services/api";
import type { EquationRequest, EquationResponse } from "../types/equation";

export function useSolveEquation() {
  return useMutation<EquationResponse, Error, EquationRequest>({
    mutationFn: solveEquation,
  });
}
