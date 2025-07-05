import React from "react";
import useDocuments from "../hooks/useDocuments";
import DocumentsList from "./DocumentsList";
import Sidebar from "./sidebar";
import Navbar from "./navbar";

const DocumentsPage = ({ userName = "User" }) => {
  const { documents, loading, error, fetchDocuments, setError } =
    useDocuments();

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased dark:bg-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <Sidebar activePage="documents" documents={documents} />

      {/* Main Content Area */}
      <main className="flex flex-col flex-grow">
        {/* Navbar */}
        <Navbar userName={userName} />

        {/* Content Area Below Navbar */}
        <div className="p-6 md:p-8 flex flex-col flex-grow overflow-y-auto items-center">
          {/* Error Message */}
          {error && (
            <div className="w-full max-w-4xl mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-600 dark:text-red-200">
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-900 dark:text-red-200 dark:hover:text-red-100"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Page Title */}
          <div className="w-full max-w-4xl mb-8 pb-4 border-b border-gray-200 text-left dark:border-gray-700">
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              My Documents
            </h1>
          </div>

          {/* Documents List */}
          <DocumentsList
            documents={documents}
            loading={loading}
            error={error}
            onRefresh={fetchDocuments}
          />
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
