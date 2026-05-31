import { useMutation } from "@tanstack/react-query";
import { solveRadioactiveDecay } from "../services/api";
import type { RadioactiveDecayRequest, RadioactiveDecayResponse } from "../types/equation";

export function useRadioactiveDecay() {
  return useMutation<RadioactiveDecayResponse, Error, RadioactiveDecayRequest>({
    mutationFn: solveRadioactiveDecay,
  });
}
