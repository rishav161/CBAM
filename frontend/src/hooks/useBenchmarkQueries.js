import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBenchmarkFactors,
  updateBenchmarkFactor,
  addBenchmarkFactor,
  uploadBenchmarkExcel,
} from '../api/benchmarkApi.js';

export function useBenchmarkFactorsQuery() {
  return useQuery({
    queryKey: ['benchmarks'],
    queryFn: getBenchmarkFactors,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateBenchmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBenchmarkFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benchmarks'] });
    },
  });
}

export function useAddBenchmarkMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBenchmarkFactor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benchmarks'] });
    },
  });
}

export function useUploadBenchmarkExcelMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadBenchmarkExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benchmarks'] });
    },
  });
}
