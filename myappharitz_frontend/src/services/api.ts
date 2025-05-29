import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const registerUser = async (userData: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const loginUser = async (userData: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/login`, userData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const verifyMFA = async (verificationData: any) => {
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/verify-mfa`, verificationData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const getUsers = async () => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/users`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const updateUser = async (id: string, updateData: any) => {
  try {
    const { data } = await axios.put(`${API_BASE_URL}/users/${id}`, updateData);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};

export const deleteUser = async (id: string) => {
  try {
    const { data } = await axios.delete(`${API_BASE_URL}/users/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};