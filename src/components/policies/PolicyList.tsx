import React, { useEffect, useState } from "react";
import { usePolicy } from "../../contexts/PolicyContext";
import PolicyCard from "./PolicyCard";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";
import { getUserVotes } from '../../services/api';

const PolicyList: React.FC = () => {
  const { policies, fetchPolicies, setPolicies, upvotePolicy } = usePolicy();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const { user } = useAuth(); 
  const [votedPolicies, setVotedPolicies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPolicies(1, 10);
    if (user) {
      const fetchUserVotes = async () => {
        try {
          const userVotes = await getUserVotes();
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
        prevIndex + 2 >= policies.length ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [policies.length]);

   
  
const handleUpvote = async (policyId: string) => {
  if (!user || votedPolicies.includes(policyId)) return;
  setLoading(true);

  try {
    await upvotePolicy(policyId);

     
     setPolicies((prevPolicies) =>
      prevPolicies.map((policy) =>
        policy._id === policyId ? { ...policy, votes: policy.votes + 1 } : policy
      )
    );

    
    setVotedPolicies((prevVotes) => [...prevVotes, policyId]);
    setLoading(false);
  } catch (error) {
    console.error("Failed to upvote policy:", error);
    setLoading(false);
  }
};

  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
          <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-gray-900">
            Latest Policies
          </h2>
          <p className="font-light text-gray-700 sm:text-xl">
            Explore the most recent proposals and have your say by upvoting the
            ones that matter most.
          </p>
        </div>
        <div className="relative overflow-hidden w-full">
          
          <motion.div
            className="flex transition-transform"
            style={{
              transform: `translateX(-${visibleIndex * 50}%)`,
            }}
          >
            {policies.map((policy) => (
              <div
                key={policy._id}
                className="w-1/2 flex-shrink-0 px-2"
              >
                <PolicyCard
                  policy={policy}
                  onUpvote={() => handleUpvote(policy._id)}
                  isGuest={!user}
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

export default PolicyList;