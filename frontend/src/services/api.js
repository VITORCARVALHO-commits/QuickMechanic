import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Configure axios to include token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== AUTH ENDPOINTS =====

export const register = async (userData) => {
  try {
    const response = await axios.post(`${API}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API}/auth/me`);
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};

// ===== VEHICLE ENDPOINTS =====

export const searchVehicleByPlate = async (plate) => {
  try {
    const response = await axios.get(`${API}/vehicle/plate/${plate}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    throw error;
  }
};

// ===== QUOTE ENDPOINTS =====

export const createQuote = async (quoteData) => {
  try {
    const response = await axios.post(`${API}/quotes`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar orçamento:', error);
    throw error;
  }
};

export const getQuote = async (quoteId) => {
  try {
    const response = await axios.get(`${API}/quotes/${quoteId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    throw error;
  }
};

export const listQuotes = async (limit = 100) => {
  try {
    const response = await axios.get(`${API}/quotes?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    throw error;
  }
};

export const getMyQuotes = async () => {
  try {
    const response = await axios.get(`${API}/quotes/my-quotes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching my quotes:', error);
    throw error;
  }
};

export const updateQuoteStatus = async (quoteId, statusData) => {
  try {
    const response = await axios.patch(`${API}/quotes/${quoteId}/status`, statusData);
    return response.data;
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};

// ===== PAYMENT ENDPOINTS =====

export const createPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API}/payments`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};

export const getMyPayments = async () => {
  try {
    const response = await axios.get(`${API}/payments/my-payments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

// ===== MECHANIC ENDPOINTS =====

export const listMechanics = async () => {
  try {
    const response = await axios.get(`${API}/mechanics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mechanics:', error);
    throw error;
  }
};
