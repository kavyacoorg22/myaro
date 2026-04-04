import axios, { AxiosError, type AxiosResponse } from "axios";
import { authRoutes } from "../constants/apiRoutes/authRoutes";
import { adminApiRoute } from "../constants/apiRoutes/adminRoutes";
import { adminFrontendRoute } from "../constants/frontendRoutes/adminFrontenRoutes";
import { publicFrontendRoutes } from "../constants/frontendRoutes/publicFrontendRoutes";

//api error
export class ApiError extends Error {
  status: number;
  body: any;

  constructor(status: number, body: any) {
    super(`API Error ${status}`);
    this.status = status;
    this.body = body;
  }
}


//axios instance
const isDev = import.meta.env.DEV;

const API_BASE = isDev
  ? ""
  : import.meta.env.VITE_API_URL || "http://localhost:4323";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
let isRefreshing = false;
let failedQueue: { resolve: (v: any) => void; reject: (e: any) => void }[] = [];

const processQueue = (error: any, token: null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

//interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.response) throw new Error("Network error");

    const status = error.response.status;
    const originalRequest: any = error.config;
    const endpoint: string = originalRequest?.url || "";

    const isAuthEndpoint = [
      authRoutes.login,
      authRoutes.preSignup,
      authRoutes.completeSignup,
      authRoutes.sendOtp,
      authRoutes.verifyOtp,
      authRoutes.reSendOtp,
      adminApiRoute.adminLogin,
    ].some((route) => endpoint.includes(route));

    const isRefreshEndpoint =
      endpoint.includes(authRoutes.refresh) ||
      endpoint.includes(authRoutes.adminRefresh);

    if (status !== 401 || originalRequest._retry || isAuthEndpoint || isRefreshEndpoint) {
      throw new ApiError(status, error.response.data);
    }

    // --- 401 that needs refresh ---

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const isAdminRequest = endpoint.includes("/admin");
    const refreshEndpoint = isAdminRequest
      ? authRoutes.adminRefresh
      : authRoutes.refresh;

    try {
      await api.post(refreshEndpoint);
      processQueue(null);
      return api(originalRequest);    // retry the original
    } catch (refreshError) {
      processQueue(refreshError);

      const loginPath = isAdminRequest
        ? adminFrontendRoute.login
        : publicFrontendRoutes.login;

      window.location.href = loginPath;
      return Promise.reject(new Error("Session expired"));
    } finally {
      isRefreshing = false;
    }
  }
);

//wrapper
export type ApiResponse<T> = {
  status: number;
  data: T;
  headers: any;
};

export async function axiosWrapper<T>(
  request: Promise<AxiosResponse<T>>
): Promise<ApiResponse<T>> {
  const res = await request;

  return {
    status: res.status,
    data: res.data,
    headers: res.headers,
  };
}

//instance
export default api;
