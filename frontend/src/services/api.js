import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

// Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk handle expired token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.delete('/logout')
};

// Candidate APIs
export const candidateAPI = {
  getAll: () => api.get('/candidates'),
  create: (formData) => api.post('/candidates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.patch(`/candidates/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/candidates/${id}`)
};

// Vote APIs
export const voteAPI = {
  vote: (candidateId) => api.post('/vote', { candidateId }),
  getAll: () => api.get('/votes')
};

export default api;