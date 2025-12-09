import { adminApiRoute } from "../constants/apiRoutes/adminRoutes";
import { authRoutes } from "../constants/apiRoutes/authRoutes";
import { publicApiRoutes } from "../constants/apiRoutes/publicApiRoute";

type ApiResponse<T> = { status: number; data: T | null; headers: Headers };

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(status: number, body: any) {
    super(`API Error ${status}`);
    this.status = status;
    this.body = body;
  }
}

export async function fetchWrapper<T = any>(
  endpoint: string,
 options: RequestInit & { params?: Record<string, any> } = {}
): Promise<ApiResponse<T>> {
  
  const isDev = import.meta.env.DEV;
  const API_BASE = isDev ? '' : (import.meta.env.VITE_API_URL || 'http://localhost:4323');


   let finalEndpoint = endpoint;
  if (options.params) {
    const searchParams = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '' && value !== 'all') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      finalEndpoint = `${endpoint}?${queryString}`;
    }
  }


 const url = `${API_BASE}/api${finalEndpoint}`; 

  console.log('🔵 fetchWrapper called');
  console.log('🔵 endpoint:', endpoint);
  console.log('🔵 Full URL:', url);
  console.log('🔵 isDev:', isDev);
  
  const headers = new Headers(options.headers || {});

  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const fetchOpts: RequestInit = {
    ...options,
    headers,
    credentials: 'include',  
  };

  console.log('🔵 Fetch options:', fetchOpts);

  let res: Response;

  try {
    res = await fetch(url, fetchOpts);
   // ✅ FIXED CODE
const isAuthEndpoint = endpoint.includes(authRoutes.login) || 
                  endpoint.includes(authRoutes.preSignup) || 
                  endpoint.includes(adminApiRoute.adminLogin);

if (res.status === 401 && !endpoint.includes(authRoutes.refresh) && !isAuthEndpoint) {
    console.log('🔄 Access token expired, attempting refresh...');
    
  
    const isAdminRequest = endpoint.startsWith('/admin');
    const refreshEndpoint = isAdminRequest 
        ? authRoutes.adminRefresh
        : authRoutes.refresh;        
    
    const refreshRes = await fetch(`${API_BASE}/api${refreshEndpoint}`, {
        method: 'POST',
        credentials: 'include',
    });
    
    if (refreshRes.ok) {
        console.log('✅ Token refreshed, retrying original request...');
        res = await fetch(url, fetchOpts);
    } else {
        console.log('❌ Refresh failed, redirecting to login...');
        const loginPath = isAdminRequest ? '/admin/login' : '/login';
        window.location.href = loginPath;
        throw new Error('Session expired');
    }
}
  } catch (err) {
    console.error('💥 Network error:', err);
    throw new Error(`Network error: ${(err as Error).message}`);
  }

  console.log('🔵 Parsing response...');
  
  let parsed: any = null;
  const contentType = res.headers.get('content-type') || '';
  
  console.log('🔵 Content-Type:', contentType);
  
  if (res.status !== 204 && contentType.includes('application/json')) {
    try {
      parsed = await res.json();
      console.log('✅ Parsed JSON:', parsed);
    } catch (e) {
      console.error('💥 Error parsing JSON:', e);
      parsed = null;
    }
  } else {
    try {
      const text = await res.text();
      console.log('✅ Response text:', text);
      parsed = text ? text : null;
    } catch {
      parsed = null;
    }
  }

  if (!res.ok) {
    console.error('❌ Response not OK:', res.status, parsed);
    throw new ApiError(res.status, parsed);
  }

  console.log('✅ Returning response:', { status: res.status, data: parsed });

  return {
    status: res.status,
    data: parsed as T,
    headers: res.headers,
  };
}