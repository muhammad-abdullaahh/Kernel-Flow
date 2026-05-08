import client from './client';

export const compareApi = {
  compare: (data) => client.post('/compare/', data),
  recommend: (processes) => client.post('/recommend/', processes),
};
