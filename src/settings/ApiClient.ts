import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ResponseBody } from '@custom_types/api';
import Cookie from 'universal-cookie';

interface FmlAPI extends AxiosInstance {
  get<T = any, R = ResponseBody<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = ResponseBody<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = ResponseBody<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = ResponseBody<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
}

const cookies = new Cookie();

export function ApiClient() {
  const scheme = process.env.TLS === 'true' ? 'https://' : 'http://';

  const api = Axios.create({
    baseURL: `${scheme}${process.env.API_DOMAIN}`,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.response.use((response) => response.data, (error) => {
    if (error.response && error.response.status === 401) {
      cookies.remove('token');
      // just in case, we saved any info related to user
      localStorage.clear();
      sessionStorage.clear();
      throw error;
    }
    throw error;
  });

  return api as FmlAPI;
}

export const Requests = ApiClient();
