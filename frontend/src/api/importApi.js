import client from './client';

export const importApi = {
  uploadCsv: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  exportReport: (sessionId) => `/api/export-report/${sessionId}`,
};
