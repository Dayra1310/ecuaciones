import { useMutation } from "@tanstack/react-query";
import { solveC14Dating } from "../services/api";
import type { C14DatingRequest, C14DatingResponse } from "../types/equation";

export function useC14Dating() {
  return useMutation<C14DatingResponse, Error, C14DatingRequest>({
    mutationFn: solveC14Dating,
  });
}
