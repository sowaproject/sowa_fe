import axios from "axios";
export { toFormData } from "../shared/formData";

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const baseURL = rawBaseUrl || "";

interface CsrfTokenResponse {
  csrfToken: string;
}

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

const csrfClient = axios.create({
  baseURL,
  withCredentials: true,
});

const SAFE_METHODS = new Set(["get", "head", "options", "trace"]);

apiClient.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase() ?? "get";
  if (SAFE_METHODS.has(method)) {
    return config;
  }

  const { data } = await csrfClient.get<CsrfTokenResponse>(
    "/api/dashboard-sowa/csrf/",
  );
  config.headers.set("X-CSRFToken", data.csrfToken);
  return config;
});
