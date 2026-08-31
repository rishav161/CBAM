import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBatchesList,
  getBatchDetails,
  uploadBatchFile,
  triggerCbamCalculation,
  downloadWordReport,
  downloadSampleExcelTemplate,
} from '../api/batchApi.js';

export function useBatchesQuery() {
  return useQuery({
    queryKey: ['batches'],
    queryFn: getBatchesList,
    staleTime: 1000 * 30, // 30 seconds
  });
}

export function useBatchDetailsQuery(batchId) {
  return useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => getBatchDetails(batchId),
    enabled: Boolean(batchId),
  });
}

export function useUploadBatchMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadBatchFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
    },
  });
}

export function useCalculateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: triggerCbamCalculation,
    onSuccess: (data, batchId) => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      queryClient.invalidateQueries({ queryKey: ['batch', batchId] });
    },
  });
}

export function useDownloadReportMutation() {
  return useMutation({
    mutationFn: downloadWordReport,
  });
}

export function useDownloadTemplateMutation() {
  return useMutation({
    mutationFn: downloadSampleExcelTemplate,
  });
}
