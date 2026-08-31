import apiClient from './apiClient.js';

export async function getBenchmarkFactors() {
  const { data } = await apiClient.get('/benchmarks');
  return data.factors;
}

export async function updateBenchmarkFactor({ id, directBenchmark, indirectBenchmark, goodsName, sector }) {
  const { data } = await apiClient.put(`/benchmarks/${id}`, {
    directBenchmark,
    indirectBenchmark,
    goodsName,
    sector,
  });
  return data;
}

export async function addBenchmarkFactor(factorData) {
  const { data } = await apiClient.post('/benchmarks', factorData);
  return data;
}

export async function uploadBenchmarkExcel(file) {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await apiClient.post('/benchmarks/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
