import { useMutation } from "@tanstack/react-query";
import { solveRadioactiveDecay } from "../services/api";
import type { RadioactiveDecayRequest, RadioactiveDecayResponse } from "../types/equation";
import type { AxiosError } from "axios";

export function useRadioactiveDecay() {
  return useMutation<RadioactiveDecayResponse, AxiosError, RadioactiveDecayRequest>({
    mutationFn: solveRadioactiveDecay,
  });
}
