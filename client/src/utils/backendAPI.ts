import axios from "axios";

export const backendAPI = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Use interceptors without directly importing Redux actions
backendAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Notify the application of 401 errors externally
      console.error("Unauthorized! Please handle token expiration.");
    }
    return Promise.reject(error);
  }
);

export default backendAPI;
