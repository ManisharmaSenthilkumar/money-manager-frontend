import axios from "axios";

const API = axios.create({
  baseURL: "https://money-manager-backend-1-08bf.onrender.com/api",
});

export const getTransactions = () => API.get("/transactions");
export const addTransaction = (data) => API.post("/transactions", data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}`);
export const getAccounts = () => API.get("/accounts");
export const createAccount = (data) => API.post("/accounts", data);
export const getAccountTransactions = (name) =>
  API.get(`/accounts/${name}/transactions`);

export const updateTransaction = (id, data) =>
  API.put(`/transactions/${id}`, data);
