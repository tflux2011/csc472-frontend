import React, { useEffect, useState } from "react";
import PolicyCard from "./PolicyCard";
import { useAuth } from "../../contexts/AuthContext";
import { getPolicies, getUserVotes, upvotePolicy } from "../../services/api";
import { Owner } from "../../contexts/PolicyContext";

// Define the Policy interface
interface Policy {
  _id: string;
  title: string;
  description: string;
  votes: number;
  owner: Owner; 
  createdAt: string; 
  category: string; 
}

interface Filters {
  categories: string[];
  years: string[];
  sortBy: string;
}

const HorizontalPolicyList: React.FC = () => {
  const { user } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    years: [],
    sortBy: "votes",
  });
  const [page, setPage] = useState(1);
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [votedPolicies, setVotedPolicies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchFilteredPolicies();
    if (user) fetchUserVotes();
  }, [filters, page, user]);

  const fetchFilteredPolicies = async () => {
    setLoading(true);
    try {
      const response = await getPolicies(page, itemsPerPage, filters);
      setPolicies(response.policies);
      setTotalPolicies(response.totalPolicies);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const userVotes = await getUserVotes();
      setVotedPolicies(userVotes.votes);
    } catch (error) {
      console.error("Failed to fetch user votes:", error);
    }
  };

  const handleUpvote = async (policyId: string) => {
    if (!user || votedPolicies.includes(policyId)) return;
    setLoading(true);
    try {
      await upvotePolicy(policyId);
      setPolicies((prev) =>
        prev.map((policy) =>
          policy._id === policyId ? { ...policy, votes: policy.votes + 1 } : policy
        )
      );
      setVotedPolicies((prevVotes) => [...prevVotes, policyId]);
    } catch (error) {
      console.error("Failed to upvote policy:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const { value, checked } = event.target;
    if (type === "category") {
      setFilters((prev) => ({
        ...prev,
        categories: checked
          ? [...prev.categories, value]
          : prev.categories.filter((c) => c !== value),
      }));
    } else if (type === "year") {
      setFilters((prev) => ({
        ...prev,
        years: checked ? [...prev.years, value] : prev.years.filter((y) => y !== value),
      }));
    }
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: event.target.value }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalPolicies / itemsPerPage);

  return (
    <div>
      <div className="flex space-x-1 mb-6">
        {/* Filters Section */}
        <div className="filters flex flex-col space-y-4 w-1/5 border-r">
          <h4 className="text-xl border-b py-3 font-bold">Filters</h4>
          
          {/* Sort by Filter */}
          <div>
            <h5 className="font-medium pb-3">Sort By</h5>
            <select
              name="sortBy"
              className="border border-gray-300 rounded px-3 py-2 w-56"
              value={filters.sortBy}
              onChange={handleSortChange}
              title="FilterBySort"
            >
              <option value="">-- Select --</option>
              <option value="date">Newest</option>
              <option value="votes">Most Upvoted</option>
            </select>
          </div>
          {/* Category Filters */}
          <div className="border-b pb-3">
            <h5 className="font-medium py-3">Categories</h5>
            <div className="space-y-2">
              {["General", "Library", "Meditation", "Education", "Visa & Travel", "Students Lounge", "Food"].map((category) => (
                <label key={category} className="block">
                  <input
                    type="checkbox"
                    value={category}
                    checked={filters.categories.includes(category)}
                    onChange={(e) => handleFilterChange(e, "category")}
                    className="mr-2"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Year Filters */}
          <div className="border-b pb-3">
            <h5 className="font-medium py-3">Browse by Years</h5>
            <div className="space-y-2">
              {["2024", "2023", "2022", "2021", "2020"].map((year) => (
                <label key={year} className="block">
                  <input
                    type="checkbox"
                    value={year}
                    checked={filters.years.includes(year)}
                    onChange={(e) => handleFilterChange(e, "year")}
                    className="mr-2"
                  />
                  {year}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 px-3">
          {loading ? (
            <p>Loading policies...</p>
          ) : policies.length > 0 ? (
            policies.map((policy, index) => (
              <div className="mb-5" key={index}>
              <PolicyCard
                key={policy._id}
                policy={policy}
                onUpvote={() => handleUpvote(policy._id)}
                isGuest={!user}
                isUpvoted={votedPolicies.includes(policy._id)}
                isLoading={loading}
              />
              </div>
            ))
          ) : (
            <>
            <img src="/empty.svg" className="w-1/4 mt-20 mx-auto" alt="empty" />
            <p className="text-center mt-5 text-2xl">No policies found</p>
            </>
          )}
        </div>
        </div>
      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center items-center">
        {page > 1 && (
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 mr-2"
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
        )}
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ml-2"
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default HorizontalPolicyList;