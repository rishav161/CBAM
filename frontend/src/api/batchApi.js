import apiClient from './apiClient.js';

export async function uploadBatchFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function getBatchesList() {
  const { data } = await apiClient.get('/upload/batches');
  return data.batches;
}

export async function getBatchDetails(batchId) {
  const { data } = await apiClient.get(`/upload/batches/${batchId}`);
  return data.batch;
}

export async function triggerCbamCalculation(batchId) {
  const { data } = await apiClient.post(`/reports/${batchId}/calculate`);
  return data;
}

export async function downloadWordReport(batchId) {
  const response = await apiClient.get(`/reports/${batchId}/download`, {
    responseType: 'blob',
  });
  
  // Trigger file download in browser
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `CBAM_Report_${batchId.slice(0, 8)}.docx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export async function downloadSampleExcelTemplate() {
  const response = await apiClient.get('/upload/template', {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'CBAM_Sample_Template.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
