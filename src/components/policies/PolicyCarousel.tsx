import React, { useEffect, useState } from "react";
import { usePolicy } from "../../contexts/PolicyContext";
import PolicyCard from "./PolicyCard";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { getUserVotes } from '../../services/api';

const PolicyCarousel: React.FC = () => {
  const { policies, fetchPolicies, setPolicies, upvotePolicy } = usePolicy();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { user } = useAuth(); 
  const [votedPolicies, setVotedPolicies] = useState<string[]>([]); // Track user votes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolicies(1, 10); // Fetch initial policies
    if (user) {
      const fetchUserVotes = async () => {
        try {
          const userVotes = await getUserVotes(); // Fetch user votes from API
          setVotedPolicies(userVotes.votes);
        } catch (error) {
          console.error("Failed to fetch user votes:", error);
        }
      };
      fetchUserVotes();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleIndex((prevIndex) =>
        prevIndex + 1 >= policies.length ? 0 : prevIndex + 1
      );
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [policies.length]);

  // Handle policy upvote
  const handleUpvote = async (policyId: string) => {
    if (!user || votedPolicies.includes(policyId)) return; // Prevent guests or duplicate votes
    setLoading(true);

    try {
      await upvotePolicy(policyId); // Call the API to register the vote

      // Update global policies state
      setPolicies((prevPolicies) =>
        prevPolicies.map((policy) =>
          policy._id === policyId ? { ...policy, votes: policy.votes + 1 } : policy
        )
      );

      // Update the user's voted policies
      setVotedPolicies((prevVotes) => [...prevVotes, policyId]);
      setLoading(false);
    } catch (error) {
      console.error("Failed to upvote policy:", error);
      setLoading(false);
    }
  };

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16">
        <div className="relative overflow-hidden w-full">
          <motion.div
            className="flex transition-transform"
            style={{
              transform: `translateX(-${visibleIndex * 100}%)`, // Each slide is 100% width
            }}
          >
            {policies.map((policy) => (
              <div
                key={policy._id}
                className="w-full flex-shrink-0 px-4" // Ensure 100% width
              >
                <PolicyCard
                  policy={policy}
                  onUpvote={() => handleUpvote(policy._id)}
                  isGuest={!user} // Indicates if the user is a guest
                  isUpvoted={votedPolicies && votedPolicies.includes(policy._id)} 
                  isLoading={loading}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PolicyCarousel;