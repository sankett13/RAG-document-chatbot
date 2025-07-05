import React from "react";
import { documentAPI } from "../services/api";

const DocumentsList = ({ documents, loading, error, onRefresh }) => {
  const handleAskQuestion = async (question) => {
    try {
      const response = await documentAPI.askQuestion(question);
      console.log("Answer:", response.answer);
      // You can handle the response here - maybe show it in a modal or update state
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Loading documents...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-600 dark:text-red-200">
        <div className="flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={onRefresh}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 dark:text-gray-400">
        <p>No documents uploaded yet.</p>
        <p className="text-sm mt-2">
          Upload your first document to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Your Documents ({documents.length})
        </h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                  {doc.filename}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const question = prompt(
                      "What would you like to ask about this document?"
                    );
                    if (question) {
                      handleAskQuestion(question);
                    }
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
                >
                  Ask Question
                </button>
                <button
                  onClick={() => {
                    // Navigate to document chat page
                    window.location.href = `/user/document/${
                      doc._id
                    }?name=${encodeURIComponent(doc.filename)}`;
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                >
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;
