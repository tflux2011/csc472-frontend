import React, { createContext, useContext, useState, useCallback } from "react";
import { getPolicies, getPolicyById, upvotePolicy as apiUpvotePolicy, createPolicy, getPolicyByUser } from "../services/api";

export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Policy {
  _id: string;
  title: string;
  description: string;
  category: string;
  votes: number;
  owner: Owner;
  createdAt: string;
}

export interface Filters {
  categories: string[];
  years: string[];
  sortBy: string;
}

interface CreatePolicyResponse {
  success: boolean;
  message: string;
  data: Policy; // The actual policy object is in the "data" field
}

type SetPolicies = React.Dispatch<React.SetStateAction<Policy[]>>;

interface PolicyContextType {
  policies: Policy[];
  setPolicies: SetPolicies;
  fetchPolicies: (page?: number, limit?: number, filters?: Filters) => Promise<void>;
  fetchPolicy: (id: string) => Promise<Policy | null>;
  fetchUserPolicies: () => Promise<Policy | null>;
  upvotePolicy: (policyId: string) => Promise<void>;
  addPolicy: ({ title, description, category }: PolicyData) => Promise<CreatePolicyResponse | null>;
  hasMore: boolean;
  totalPolicies: number;
}

export interface PolicyData {
  title: string;
  description: string;
  category: string;
}

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export const PolicyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true); // Track if there are more pages
  const [currentPage, setCurrentPage] = useState<number>(1); // Track the current page
  const [totalPolicies, setTotalPolicies] = useState<number>(0); // Track the total number of policies
  const [isFetching, setIsFetching] = useState<boolean>(false); // Prevent duplicate calls

  const fetchPolicies = useCallback(
    async (page = currentPage, limit = 10, filters: Filters = { categories: [], sortBy: "date", years: [] }) => {
      if (isFetching || !hasMore) return; // Avoid duplicate fetching or fetching beyond limits
      setIsFetching(true); // Mark fetching in progress

      try {
        const data = await getPolicies(page, limit, filters); // API call with the current page
        setPolicies((prev) => {
          const newPolicyIds = new Set(data.policies.map((policy: Policy) => policy._id));
          const uniquePolicies = prev.filter((policy) => !newPolicyIds.has(policy._id));
          return [...uniquePolicies, ...data.policies]; // Append only unique policies
        });
        setHasMore(data.hasMore);
        setTotalPolicies(data.totalPolicies); // Update totalPolicies from the API response
        setCurrentPage(page + 1); // Increment page
      } catch (error) {
        console.error("Error fetching policies:", error);
      } finally {
        setIsFetching(false); // Reset fetching state
      }
    },
    [isFetching, hasMore, currentPage]
  );

  const fetchPolicy = useCallback(async (id: string): Promise<Policy | null> => {
    try {
      const policy = await getPolicyById(id); // API call to fetch a specific policy by ID
      return policy;
    } catch (error) {
      console.error(`Error fetching policy with id ${id}:`, error);
      return null;
    }
  }, []);

  const fetchUserPolicies = useCallback(async () => {
    try {
      const response = await getPolicyByUser();
      if (response.success) {
        setPolicies(response.data);
        return response.data; 
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching user policies:", error);
    }
  }, []);

  // Upvote a policy
  const upvotePolicy = useCallback(async (policyId: string) => {
    try {
      const updatedPolicy = await apiUpvotePolicy(policyId); // Call upvote API
      setPolicies((prev) =>
        prev.map((policy) =>
          policy._id === updatedPolicy._id ? updatedPolicy : policy
        )
      );
    } catch (error) {
      console.error("Error upvoting policy:", error);
    }
  }, []);

  const addPolicy = useCallback(async ({ title, description, category }: PolicyData) => {
    try {
      // Call API to create a policy
      const newPolicy = await createPolicy({ title, description, category });

      // Assuming the API returns the full policy object
      // Add the newly created policy to the policies state
      setPolicies((prevPolicies) => [
        ...prevPolicies, // Add the new policy to the list
        newPolicy,       // Add the newly created policy
      ]);
      return newPolicy;
    } catch (error) {
      console.error("Error adding policy:", error);
    }
  }, []);

  return (
    <PolicyContext.Provider
      value={{ policies, fetchPolicies, fetchPolicy, fetchUserPolicies, upvotePolicy, hasMore, totalPolicies, setPolicies, addPolicy }}
    >
      {children}
    </PolicyContext.Provider>
  );
};

export const usePolicy = () => {
  const context = useContext(PolicyContext);
  if (!context) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
};