import axios from "axios";

// Set the base URL for all axios requests
axios.defaults.baseURL = process.env.REACT_APP_URL || "http://localhost:5100";

// Add request interceptor to include credentials and token
axios.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // Set credentials to true for cross-origin requests
    config.withCredentials = true;
    
    // Add token to Authorization header if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized errors
      if (error.response.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      // Handle other errors
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axios;
