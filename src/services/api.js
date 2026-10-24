import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send HTTP-only refresh cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('split_access_token');
    if (accessToken) {
      if (config.headers?.set) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
      } else {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } else if (config.headers) {
      if (config.headers.delete) {
        config.headers.delete('Authorization');
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip retry on auth endpoints to prevent infinite refresh loops
    if (
      !originalRequest ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      const fallbackRefreshToken = localStorage.getItem('split_refresh_token');

      // If no refresh token is stored, immediately wipe session and notify without doomed network call
      if (!fallbackRefreshToken) {
        localStorage.removeItem('split_access_token');
        localStorage.removeItem('split_refresh_token');
        localStorage.removeItem('split_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken: fallbackRefreshToken },
          { withCredentials: true }
        );

        const newAccessToken = data?.data?.accessToken;
        const newRefreshToken = data?.data?.refreshToken;

        if (newAccessToken) {
          localStorage.setItem('split_access_token', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('split_refresh_token', newRefreshToken);
          }
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);

          if (originalRequest.headers?.set) {
            originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('split_access_token');
        localStorage.removeItem('split_refresh_token');
        localStorage.removeItem('split_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
