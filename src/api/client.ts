import axios from "axios";
export { toFormData } from "../shared/formData";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

export const apiClient = axios.create({
  baseURL: rawBaseUrl || "",
  withCredentials: true,
});
