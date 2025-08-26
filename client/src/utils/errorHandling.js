// Error handling utilities for consistent error messages across the app

export const getErrorMessage = (error, context = "operation") => {
  if (error.response?.status === 404) {
    return `${context === "fetch" ? "Entry not found" : "Resource not found"}`;
  } else if (error.response?.status === 403) {
    return `You don't have permission to ${context} this resource`;
  } else if (error.response?.status === 400) {
    return error.response.data?.error || `Invalid ${context} data`;
  } else if (error.code === "NETWORK_ERROR" || !error.response) {
    return "Network error. Please check your connection and try again.";
  } else if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  } else if (error.response?.data?.error) {
    return error.response.data.error;
  }

  return `Failed to ${context}`;
};

export const handleApiError = (error, context = "operation") => {
  console.error(`Error during ${context}:`, error);
  return getErrorMessage(error, context);
};

// Common error contexts
export const ERROR_CONTEXTS = {
  FETCH_ENTRY: "fetch entry",
  UPDATE_ENTRY: "update entry",
  DELETE_ENTRY: "delete entry",
  LOGIN: "login",
  SIGNUP: "signup",
  CREATE_ENTRY: "create entry",
  ANALYZE_MOOD: "analyze mood",
  FETCH_PROFILE: "fetch profile",
  FETCH_ENTRIES: "fetch entries",
};
