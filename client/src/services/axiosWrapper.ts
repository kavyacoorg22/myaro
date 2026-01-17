import axios, { AxiosError, type AxiosResponse } from "axios";
import { authRoutes } from "../constants/apiRoutes/authRoutes";
import { adminApiRoute } from "../constants/apiRoutes/adminRoutes";

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

//interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    if (!error.response) {
      throw new Error("Network error");
    }

    const status = error.response.status;
    const originalRequest: any = error.config;
    const endpoint = originalRequest?.url || "";

    const isAuthEndpoint =
      endpoint.includes(authRoutes.login) ||
      endpoint.includes(authRoutes.preSignup) ||
      endpoint.includes(adminApiRoute.adminLogin)|| endpoint.includes(authRoutes.completeSignup)||endpoint.includes(authRoutes.sendOtp)||endpoint.includes(authRoutes.verifyOtp)||endpoint.includes(authRoutes.reSendOtp);

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      const isAdminRequest = endpoint.startsWith("/admin");
      const refreshEndpoint = isAdminRequest
        ? authRoutes.adminRefresh
        : authRoutes.refresh;

      try {
        await api.post(refreshEndpoint);
        return api(originalRequest); 
      } catch {
        const loginPath = isAdminRequest ? adminApiRoute.adminLogin : authRoutes.login;
        window.location.href = loginPath;
        throw new Error("Session expired");
      }
    }

    throw new ApiError(status, error.response.data);
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
