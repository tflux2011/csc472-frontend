import { useState, useEffect } from "react";
import moment from "moment";
import Footer from "../components/Footer";
import Navbar from "../components/NavBar";
import { Policy, usePolicy } from "../contexts/PolicyContext";
import { useParams } from "react-router-dom";
import PolicyCarousel from "../components/policies/PolicyCarousel";
import { useAuth } from "../contexts/AuthContext";
import { upvotePolicy } from "../services/api";


const PolicySinglePage = () => {
  const { fetchPolicy } = usePolicy();
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [votes, setVotes] = useState<number>(0); 
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); 
  const [votedPolicies, setVotedPolicies] = useState<string[]>([]); // Track user votes
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPolicy = async () => {
      if (id) {
        const fetchedPolicy = await fetchPolicy(id);
        setPolicy(fetchedPolicy);
        setVotes(fetchedPolicy?.votes || 0); 
      }
    };

    loadPolicy();
  }, [fetchPolicy, id]);

  // Handle user upvote
  const handleUpvote = async () => {
    if (!policy || !user) {
      alert("You must be logged in to vote!");
      return;
    }
  
    if (votedPolicies.includes(policy._id)) {
      alert("You have already voted for this policy.");
      return;
    }
  
    setLoading(true);
    try {
      
      const response = await upvotePolicy(policy._id);
  
      if (response.success) {
        setVotes((prev) => prev + 1); 
        setVotedPolicies((prev) => [...prev, policy._id]); 
      } else {
        alert(response.message || "You have already voted.");
      }
    } catch (error) {
      console.error("Failed to upvote policy:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!policy) return <div>Loading policy...</div>;

  return (
    <>
      <Navbar active="policies" />
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white antialiased">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <button
                    onClick={handleUpvote}
                    className="flex items-center justify-center w-16 h-16 text-2xl font-bold bg-blue-600 text-white hover:bg-blue-500 focus:outline-none"
                    aria-label="Upvote"
                    disabled={loading}
                  >
                    {loading ? (
                      <span>
                        <svg
                          aria-hidden="true"
                          className="w-4 h-4 text-gray-200 animate-spin dark:text-white fill-blue-600"
                          viewBox="0 0 100 101"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </span>
                    ) : (
                      `+${votes}`
                    )}
                  </button>
                  <div className="ml-4">
                    <h1 className="text-3xl font-extrabold leading-tight text-gray-900 lg:mb-1 lg:text-4xl">
                      {policy.title}
                    </h1>
                    <span className="text-gray-900 ml-1">
                      By {policy.owner.name} | Created on{" "}
                      {moment(policy.createdAt).format("LL")}
                    </span>
                  </div>
                </div>
              </address>
            </header>
            <p className="lead">{policy.description}</p>
          </article>
        </div>
      </main>
      <PolicyCarousel />
      <Footer />
    </>
  );
};

export default PolicySinglePage;