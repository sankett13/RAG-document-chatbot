// pages/Dashboard.jsx
import React, { useState } from "react";
// Adjust paths based on your actual file structure
import Sidebar from "./sidebar";
import Navbar from "./navbar";
import UploadDocument from "./upload_doc";
import ChatDocument from "./ChatDocument";
import useDocuments from "../hooks/useDocuments";
// No need to import "./dashboard.css" anymore

const Dashboard = ({
  activePage = "upload", // This would typically come from router or state
  userName = "User", // This would typically come from auth context/state
}) => {
  // Use the custom hook to manage documents
  const { documents, loading, error, uploadDocument, setError } =
    useDocuments();

  // State for selected document
  const [selectedDocument, setSelectedDocument] = useState(null);

  // Handler for document selection
  const handleDocumentSelect = (document) => {
    setSelectedDocument(document);
  };

  // Handler to go back to upload view
  const handleBackToUpload = () => {
    setSelectedDocument(null);
  };

  return (
    <div
      className="
      flex min-h-screen bg-gray-100 font-sans antialiased
      dark:bg-gray-900 dark:text-gray-100
    "
    >
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        documents={documents}
        onDocumentSelect={handleDocumentSelect}
      />

      {/* Main Content Area */}
      <main className="flex flex-col flex-grow">
        {/* Navbar */}
        <Navbar userName={userName} />

        {/* Content Area Below Navbar */}
        <div
          className="
          p-6 md:p-8 flex flex-col flex-grow overflow-y-auto
          items-center {/* This centers content like the upload card horizontally */}
        "
        >
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

          {/* The main page title for the section */}
          <div
            className="
            w-full max-w-4xl mb-8 pb-4 border-b border-gray-200 text-left
            dark:border-gray-700
          "
          >
            <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
              {selectedDocument ? "Chat with Document" : "Upload New Document"}
            </h1>
          </div>

          {/* Conditional Rendering - Show either Upload or Chat component */}
          {selectedDocument ? (
            <ChatDocument
              selectedDocument={selectedDocument}
              onBack={handleBackToUpload}
            />
          ) : (
            <UploadDocument onUpload={uploadDocument} loading={loading} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
