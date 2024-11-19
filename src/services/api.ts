import axios from "axios";
import apiClient, {API_URL} from "./apiClient"; // Import the customized Axios instance
import { Filters } from "../contexts/PolicyContext";

export const getPolicies = async (page: number, limit: number, filters: Filters) => {
  try {
    // Build the query string with filters
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      // ...(filters.categories.length > 0 ? { categories: filters.categories.join(",") } : {}),
      ...(filters.sortBy ? { sortBy: filters.sortBy } : {}),
    });

    filters.categories.forEach((category) => {
      queryParams.append("categories", category);
    });

    filters.years.forEach((year) => {
      queryParams.append("year", year);
    });

    const response = await apiClient.get(`/api/policies?${queryParams.toString()}`);
    return response.data; // Assuming { policies, hasMore } structure
  } catch (error) {
    console.error("Error fetching policies:", error);
    throw error;
  }
};

// Fetch a single policy by ID
export const getPolicyById = async (_id: string) => {
  try {
    const response = await apiClient.get(`/api/policies/${_id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policy:", error);
    throw error;
  }
};

export const getPolicyByUser = async () => {
  try {
    const response = await apiClient.get(`/api/policies/user-policies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policy:", error);
    throw error;
  }
};

export const getUserVotes = async () => {
  try {
    const response = await apiClient.get(`/api/policies/votes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching policy:", error);
    throw error;
  }
};

// Upvote a policy
export const upvotePolicy = async (policyId: string) => {
  try {
    const response = await apiClient.post(`/api/policies/${policyId}/upvote`);
    return response.data; // Assuming it returns the updated policy
  } catch (error) {
    console.error("Error upvoting policy:", error);
    throw error;
  }
};

// Create a new policy
export const createPolicy = async (policyData: { title: string; description: string; category: string }) => {
  try {
    const response = await apiClient.post(`/api/policies`, policyData);
    return response.data;
  } catch (error) {
    console.error("Error creating policy:", error);
    throw error;
  }
};

export const deletePolicy = async (policyId: string) => {
  try {
    const response = await apiClient.delete(`/api/policies/${policyId}/`);
    return response.data; // Assuming it returns the updated policy
  } catch (error) {
    console.error("Error upvoting policy:", error);
    throw error;
  }
};

// Update existing policy
export const updatePolicy = async (policyData: { title: string; description: string; category: string }, id:string) => {
  try {
    const response = await apiClient.put(`/api/policies/${id}`, policyData);
    return response.data;
  } catch (error) {
    console.error("Error updating policy:", error);
    throw error;
  }
};

// Voting on a policy
export const votePolicy = async (policyId: string) => {
  try {
    const response = await apiClient.post(`/api/policies/${policyId}/vote`);
    return response.data;
  } catch (error) {
    console.error("Error voting on policy:", error);
    throw error;
  }
};


// User Signup
export const signup = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

// User Login
export const loginApi = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    return response.data; // Save token to localStorage after successful login
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};