import { useMutation } from "@tanstack/react-query";
import { solvePopulationGrowth } from "../services/api";
import type { PopulationGrowthRequest, PopulationGrowthResponse } from "../types/equation";
import type { AxiosError } from "axios";

export function usePopulationGrowth() {
  return useMutation<PopulationGrowthResponse, AxiosError, PopulationGrowthRequest>({
    mutationFn: solvePopulationGrowth,
  });
}
