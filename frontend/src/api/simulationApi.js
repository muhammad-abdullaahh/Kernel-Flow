import client from './client';

export const simulationApi = {
  start: (data) => client.post('/simulation/start', data),
  runBatch: (data) => client.post('/simulation/batch', data),
  pause: (sessionId) => client.post(`/simulation/pause/${sessionId}`),
  resume: (sessionId) => client.post(`/simulation/resume/${sessionId}`),
  step: (sessionId) => client.post(`/simulation/step/${sessionId}`),
  stop: (sessionId) => client.post(`/simulation/stop/${sessionId}`),
  getAlgorithms: () => client.get('/algorithms/'),
  calculateMetrics: (data) => client.post('/metrics/calculate', data),
};
