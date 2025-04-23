import React, { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getUserProfileAPI } from "../../apis/user/userAPI";
import StatusMessage from "../Alert/StatusMessage";
import { Link } from "react-router-dom";

const ContentGenerationHistory = () => {
  const [expandedContentId, setExpandedContentId] = useState(null); // State to track expanded content

  // Get the user profile
  const { isLoading, isError, data, error } = useQuery({
    queryFn: getUserProfileAPI,
    queryKey: ["profile"],
  });

  console.log(data);

  // Displaying loading
  if (isLoading) {
    return <StatusMessage type="loading" message="Loading please wait..." />;
  }

  // Displaying error
  if (isError) {
    return <StatusMessage type="error" message={error?.response?.data?.message} />;
  }

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Content Generation History
        </h2>
        {/* Button to create new content */}
        <Link
          to="/generate-content"
          className="mb-4 w-72 bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 flex items-center"
        >
          <FaPlusSquare className="mr-2" /> Create New Content
        </Link>
        {/* Content history list */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {data?.user?.history?.length <= 0 ? (
            <h1>No History Found</h1>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data?.user?.history?.map((content) => {
                const isExpanded = expandedContentId === content?._id; // Check if this content is expanded
                return (
                  <li
                    key={content?.id}
                    className={`px-6 py-4 flex flex-col space-y-2 cursor-pointer hover:bg-gray-100 ${
                      isExpanded ? "bg-gray-200" : ""
                    }`}
                    onClick={() =>
                      setExpandedContentId(isExpanded ? null : content?._id)
                    } // Toggle expanded state
                  >
                    <div className="flex-1 min-w-0">
                      {/* Display full content if expanded, otherwise show truncated content */}
                      <p className="text-sm font-medium text-gray-900">
                        {isExpanded ? content?.content : content?.content.slice(0, 50) + "..."}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(content?.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {/* Show full content below if expanded */}
                    {isExpanded && (
                      <div className="mt-2 text-gray-700">
                        <p>{content?.content}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentGenerationHistory;