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
  const token = localStorage.getItem("verso-token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Several requests can 401 at once (e.g. components fetching on mount). They
// share one in-flight refresh: the backend rotates the refresh token on every
// call, so independent /auth/refresh calls would invalidate each other's new
// token and log the user out.
let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<{ success: boolean; data: { accessToken: string } }>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .then(({ data }) => data?.data?.accessToken ?? null)
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

instance.interceptors.response.use(
  (res) => {
    if (res.data?.success !== undefined) res.data = res.data.data;
    return res;
  },
  async (err) => {
    const orig = err.config as AxiosRequestConfig & { _retry?: boolean };
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        localStorage.setItem("verso-token", newToken);
        if (orig.headers) orig.headers.Authorization = `Bearer ${newToken}`;
        return instance(orig);
      }
      localStorage.removeItem("verso-token");
    }
    return Promise.reject(err);
  }
);

/**
 * Timeout for the auth endpoints.
 *
 * A Render free-tier cold start can take ~48s to answer a request, so the
 * timeout must exceed that: otherwise a registration that succeeds server-side
 * (account created, code emailed) could still show the user a failure. 70s clears
 * the worst case, and `warmBackend()` below usually means the wait never happens.
 */
export const AUTH_TIMEOUT = 70_000;

let warmed = false;

/**
 * Wakes a sleeping free-tier backend before the user needs it.
 *
 * Call this when an auth surface opens: filling in the form takes a person
 * twenty seconds or more, so the cold start overlaps with typing instead of
 * following the submit button. Fire-and-forget on purpose: the caller must not
 * await it, and a failure here is not worth reporting because the real request
 * will surface any problem itself.
 */
export function warmBackend(): void {
  if (warmed) return;
  warmed = true;
  instance
    .get("/locations/featured", { timeout: AUTH_TIMEOUT })
    .catch(() => { /* Best effort — the real call reports any failure. */ });
}

export const apiClient = {
  get:    <T>(url: string, cfg?: AxiosRequestConfig) => instance.get<T>(url, cfg).then(r => r.data as T),
  post:   <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.post<T>(url, data, cfg).then(r => r.data as T),
  patch:  <T>(url: string, data?: unknown, cfg?: AxiosRequestConfig) => instance.patch<T>(url, data, cfg).then(r => r.data as T),
  delete: <T>(url: string, cfg?: AxiosRequestConfig) => instance.delete<T>(url, cfg).then(r => r.data as T),
};
