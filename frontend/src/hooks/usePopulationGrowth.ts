import { useMutation } from "@tanstack/react-query";
import { solvePopulationGrowth } from "../services/api";
import type { PopulationGrowthRequest, PopulationGrowthResponse } from "../types/equation";

export function usePopulationGrowth() {
  return useMutation<PopulationGrowthResponse, Error, PopulationGrowthRequest>({
    mutationFn: solvePopulationGrowth,
  });
}
