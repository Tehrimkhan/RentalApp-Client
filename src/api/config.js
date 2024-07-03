import axios from "axios";
export const API = axios.create({
  withCredentials: true,
  baseURL: "https://1992-58-65-198-76.ngrok-free.app/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
