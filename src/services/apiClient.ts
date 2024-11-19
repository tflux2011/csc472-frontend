import axios from "axios";

export const API_URL = "https://policy.sirleafda.com"; // Replace with your actual backend URL

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
});

const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

// Add an interceptor to include the token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;