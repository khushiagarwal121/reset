import axios from "axios";

// Custom API hook to configure and return Axios instances
export const useApi = () => {
  const config = useRuntimeConfig(); // Access runtime configuration

  // Create Axios instance for JSON requests
  const api = axios.create({
    baseURL: config.public.apiBase, // Base URL for the API
    withCredentials: true, // Send cookies with requests
    headers: {
      "Content-Type": "application/json", // JSON content type
      Accept: "application/json", // Accept JSON responses
    },
  });

  // Create Axios instance for multipart/form-data requests
  const formApi = axios.create({
    baseURL: config.public.apiBase, // Base URL for the API
    withCredentials: true, // Send cookies with requests
    headers: {
      "Content-Type": "multipart/form-data", // Multipart content type for file uploads
      Accept: "application/json", // Accept JSON responses
    },
  });

  // Return both Axios instances for different types of requests
  return { api, formApi };
};
