import axios from "axios";
import { LoginType, RegisterType } from "@/types/form";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
axios.defaults.withCredentials = true;

export const register = async (data: RegisterType): Promise<any> => {
  const res = await axios.post(`${API_BASE_URL}/auth/register`, data);
  return res.data;
};

export const login = async (data: LoginType): Promise<any> => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};

export const logout = async (): Promise<void> => {
  await axios.get(`${API_BASE_URL}/auth/logout`);
};
