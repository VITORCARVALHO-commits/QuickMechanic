import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Buscar veículo pela placa
export const searchVehicleByPlate = async (plate) => {
  try {
    const response = await axios.get(`${API}/vehicle/plate/${plate}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar veículo:', error);
    throw error;
  }
};

// Criar orçamento
export const createQuote = async (quoteData) => {
  try {
    const response = await axios.post(`${API}/quotes`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar orçamento:', error);
    throw error;
  }
};

// Buscar orçamento por ID
export const getQuote = async (quoteId) => {
  try {
    const response = await axios.get(`${API}/quotes/${quoteId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar orçamento:', error);
    throw error;
  }
};

// Listar todos os orçamentos
export const listQuotes = async (limit = 100) => {
  try {
    const response = await axios.get(`${API}/quotes?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar orçamentos:', error);
    throw error;
  }
};
