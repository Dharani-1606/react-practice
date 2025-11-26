import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  AxiosError,
  type AxiosResponse
} from "axios";

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional: increase if API is slow
});

// Add a request interceptor 
axiosInstance.interceptors.request.use(
    (config: any) => {
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }
)

export default axiosInstance;
