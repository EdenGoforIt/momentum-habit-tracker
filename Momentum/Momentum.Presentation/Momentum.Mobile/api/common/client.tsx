import axios from "axios";
export const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});
