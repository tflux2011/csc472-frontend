import React from "react";
import { Owner } from "../../contexts/PolicyContext";
import moment from 'moment'
import { Link } from "react-router-dom";

interface PolicyCardProps {
  policy: { _id: string; title: string; description: string; votes: number, owner: Owner, createdAt:string, category:string};
  onUpvote: () => void;
  isGuest: boolean;
  isUpvoted: boolean;
  isLoading: boolean;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onUpvote, isGuest, isUpvoted,isLoading }) => {

  return (
    <article className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 text-gray-500">
    <span className="badge flex items-center gap-x-2 mb-2 sm:mb-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmarks w-4 h-4" viewBox="0 0 16 16">
        <path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z" />
        <path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1" />
      </svg>
      {policy.category}
    </span>
    <span className="text-sm badge">{moment(policy.createdAt).year()}</span>
  </div>

  <h2 className="mb-2 text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
    <Link to={`/policies/${policy._id}`}>{policy.title}</Link>
  </h2>
  <p className="mb-5 font-light text-gray-500 dark:text-gray-400 text-sm sm:text-base">
    {policy.description.substr(0, 100)}
  </p>

  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-y-3 sm:gap-y-0">
    <div className="flex items-center space-x-4">
      <img
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
        alt="Jese Leos avatar"
      />
      <span className="font-medium dark:text-white text-sm sm:text-base">
        {policy.owner.name}
      </span>
    </div>

    {isGuest && (
      <span className="btn-sr-primary text-xs sm:text-sm">Total Votes ({policy.votes})</span>
    )}

    {!isGuest && !isUpvoted && (
      <button
        onClick={onUpvote}
        className="btn-sr-primary flex items-center justify-center gap-x-2 text-xs sm:text-sm"
      >
        {isLoading && (
          <span>
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-200 animate-spin dark:text-white fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </span>
        )}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus text-xl font-bold" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>{" "}
        Upvote ({policy.votes})
      </button>
    )}

    {!isGuest && isUpvoted && (
      <span className="btn-sr-primary text-xs sm:text-sm" title="You've already voted">
        Votes ({policy.votes})
      </span>
    )}
  </div>
</article>
    
  );
};

export default PolicyCard;