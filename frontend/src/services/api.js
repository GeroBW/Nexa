import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/",
});

// Function to handle API requests dynamically
export const apiRequest = async (method, endpoint, data = null) => {
  try {
    const response = await API({
      method,
      url: endpoint,
      data,
    });
    return response.data; // Return the successful response data
  } catch (error) {
    // Handle HTTP and validation errors
    const errorDetail =
      error.response?.data?.detail || "An unexpected error occurred.";
    throw new Error(errorDetail);
  }
};

// Specific functions for the defined endpoints

// Fetch all candidates
export const fetchCandidates = async () => {
  return await apiRequest("get", "/person/");
};

// Add a candidate
export const addCandidate = async (candidateData) => {
  return await apiRequest("post", "/person/", candidateData);
};

// Login
export const login = async (loginData) => {
  return await apiRequest("post", "/auth/login", loginData);
};

// Register
export const register = async (registerData) => {
  return await apiRequest("post", "/auth/register", registerData);
};

export const getUsers = async () => {
  return await apiRequest("get", "/auth/users");
};

export default API;
