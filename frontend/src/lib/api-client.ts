import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

// Tolerates VITE_API_URL being set without the `/api` suffix or with a trailing
// slash (e.g. "https://host.onrender.com" or ".../api/") — every backend route
// lives under /api, so a misconfigured env var would otherwise silently 404
// every request.
function resolveBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL ?? "http://localhost:5000/api").replace(/\/+$/, "");
  return raw.endsWith("/api") ? raw : `${raw}/api`;
}

const BASE_URL = resolveBaseUrl();

const instance = axios.create({
  baseURL: BASE_URL,
  // Free-tier hosts (Render, etc.) spin the backend down after inactivity; the
  // first request after that can take 30-50s to cold-start before it reaches route
  // logic, so the default timeout must be generous.
  timeout: 20_000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("trova-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use((res) => {
  if (res.data?.success !== undefined) res.data = res.data.data;
  return res;
});

export const apiClient = {
  get:    <T>(url: string, cfg?: AxiosRequestConfig) => instance.get<T>(url, cfg).then(r => r.data as T),
  post:   <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.post<T>(url, data, cfg).then(r => r.data as T),
  patch:  <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.patch<T>(url, data, cfg).then(r => r.data as T),
  delete: <T>(url: string, cfg?: AxiosRequestConfig) => instance.delete<T>(url, cfg).then(r => r.data as T),
};
