import { useEffect, useState } from "react";
import { usePolicy } from "../contexts/PolicyContext";
import moment from "moment";
import { Link } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Modal from "../components/Modal";
import { deletePolicy } from '../services/api';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const { fetchUserPolicies, policies } = usePolicy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currPolicy, setCurrPolicy] = useState<string>('')

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

useEffect(() => {
  const loadUserPolicies = async () => {
    const userPolicies = await fetchUserPolicies();
    if (userPolicies) {
      // console.log("Fetched user-specific policies:", userPolicies);
    } else {
      console.log("Failed to fetch user policies.");
    }
  };

  loadUserPolicies();
}, [fetchUserPolicies]);

  // Calculate total pages
  const totalPages = Math.ceil((policies?.length || 0) / itemsPerPage);

  // Slice policies for current page
  const currentPolicies = policies?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle navigation
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const onHandleDelete = (id:string) => {
    setCurrPolicy(id);
    setIsModalOpen(true)
  }

  const handleDelete = async () =>{
    if(currPolicy){
      const res = await deletePolicy(currPolicy);
      setIsModalOpen(false);
      toast(res.message);
      fetchUserPolicies();
    }
  }

  return (
    <>
      <div className="flex-1 sm:ml-64">
        <DashboardHeader />
        <div className="p-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <caption className="p-5 text-lg font-semibold text-left rtl:text-right text-gray-900 bg-white">
                <Link to="/policies">Policies</Link>
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Browse a list of your policies
                </p>
              </caption>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Votes
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPolicies &&
                  currentPolicies.map((policy) => (
                    <tr key={policy._id} className="bg-white border-b group">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-break-spaces"
                    >
                      <Link to={`/policies/${policy._id}`} target="_blank">
                        {policy.title}
                      </Link>
                      <div className="text-xs invisible group-hover:visible text-blue-800 mt-2">
                        <Link to={`/dashboard/edit-policy/${policy._id}`}>
                          Edit
                        </Link>
                        &nbsp;|&nbsp;
                        <span
                          onClick={() => onHandleDelete(policy._id)}
                          className="cursor-pointer"
                        >
                          Trash
                        </span>
                        &nbsp;|&nbsp;
                        <Link to={`/policies/${policy._id}`} target="_blank">
                          View
                        </Link>
                      </div>
                    </th>
                    <td className="px-6 py-4 whitespace-break-spaces">
                      {policy.description.substr(0, 100)}
                    </td>
                    <td className="px-6 py-4">{policy.category}</td>
                    <td className="px-6 py-4">{policy.votes}</td>
                    <td className="px-6 py-4">
                      {moment(policy.createdAt).format("LL")}
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
            <Modal
              isOpen={isModalOpen}
              title="Delete Policy"
              message="Are you sure you want to delete this policy?"
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleDelete}
            />
            <ToastContainer />
            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t sm:px-6">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 ${
                  currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;