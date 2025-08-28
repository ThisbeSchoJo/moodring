// API configuration and utilities
// Centralized configuration for API endpoints and settings

import axios from "axios";

// Base URL for API calls - can be overridden by environment variables
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5555";

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,
  USERS: `${API_BASE_URL}/users`,
  ENTRIES: `${API_BASE_URL}/entries`,
  ANALYZE_MOOD: `${API_BASE_URL}/analyze-mood`,
  USER_PROFILE: (userId) => `${API_BASE_URL}/user-profile/${userId}`,
  ENTRY_BY_ID: (id) => `${API_BASE_URL}/entries/${id}`,
  ENTRIES_BY_USER: (userId) => `${API_BASE_URL}/entries?user_id=${userId}`,
};

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for future use (e.g., adding auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // Could add auth token here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling could be added here
    return Promise.reject(error);
  }
);

export default apiClient;
