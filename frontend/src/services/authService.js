import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance with credentials
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
let refreshSubscribers = [];

// Helper function to process queued requests
const processQueue = (error, token = null) => {
  refreshSubscribers.forEach((callback) => {
    if (error) {
      callback(error);
    } else {
      callback(token);
    }
  });
  refreshSubscribers = [];
};

// Add request interceptor to add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if we should attempt refresh
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refreshtoken") && // Don't retry refresh requests
      !originalRequest.url.includes("/auth/me") // Don't retry auth check requests
    ) {
      if (isRefreshing) {
        // If we're already refreshing, add this request to queue
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const response = await api.post("/auth/refreshtoken");
        const { accessToken } = response.data;

        // Save the new token
        localStorage.setItem("token", accessToken);

        // Update authorization header
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear token
        localStorage.removeItem("token");
        processQueue(refreshError);
        isRefreshing = false;

        // Don't redirect to login for API calls
        if (!originalRequest.url.includes("/auth/me")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth service methods
const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log("Sending registration request:", {
        ...userData,
        password: "****",
      });
      const response = await api.post("/auth/register", userData);
      console.log("Registration API response:", response.data);

      if (response.data.accessToken) {
        console.log("Storing token in localStorage");
        localStorage.setItem("token", response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error(
        "Registration API error:",
        error.response?.data || error.message
      );
      if (error.response?.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please try again in a few minutes."
        );
      }
      throw error;
    }
  },

  // Login user
  login: async (userData) => {
    try {
      console.log("Sending login request for:", userData.email);
      const response = await api.post("/auth/login", userData);
      console.log("Login API response:", response.data);

      if (response.data.accessToken) {
        console.log("Storing token in localStorage");
        localStorage.setItem("token", response.data.accessToken);
      }
      return response.data;
    } catch (error) {
      console.error("Login API error:", error.response?.data || error.message);
      if (error.response?.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please try again in a few minutes."
        );
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log("Sending logout request");
      const response = await api.get("/auth/logout");
      localStorage.removeItem("token");
      console.log("Logout successful, token removed");
      return response.data;
    } catch (error) {
      localStorage.removeItem("token");
      console.error("Logout error:", error);
      return { success: true }; // Return success even if API call fails
    }
  },

  // Get current user
  getCurrentUser: async () => {
    // Only attempt to get current user if a token exists
    if (!localStorage.getItem("token")) {
      console.log("No token found, skipping getCurrentUser call");
      return null;
    }

    try {
      console.log("Sending request to get current user");
      const response = await api.get("/auth/me");
      console.log("Current user data received:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "getCurrentUser error:",
        error.response?.data || error.message
      );
      // Clear token if unauthorized
      if (error.response?.status === 401) {
        console.log("Unauthorized response, clearing token");
        localStorage.removeItem("token");
      }
      return null;
    }
  },
};

export default authService;
