// components/UploadDocument.jsx
import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faFilePdf,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
// No need to import the main CSS file anymore for this component

const UploadDocument = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const API_URL = "http://localhost:3000"; // Adjust this to your backend URL

  const handleFiles = useCallback((files) => {
    if (files.length === 0) return;

    const file = files[0];

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = (event) => {
    handleFiles(event.target.files);
  };

  // Using direct classList manipulation for drag-over effect
  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.classList.add(
      "border-blue-500",
      "bg-blue-50",
      "text-blue-700"
    ); // Tailwind classes for drag-over
    event.currentTarget.classList.remove("border-gray-300"); // Remove default border on drag over
  };

  const handleDragLeave = (event) => {
    event.currentTarget.classList.remove(
      "border-blue-500",
      "bg-blue-50",
      "text-blue-700"
    );
    event.currentTarget.classList.add("border-gray-300"); // Re-add default border
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove(
      "border-blue-500",
      "bg-blue-50",
      "text-blue-700"
    );
    event.currentTarget.classList.add("border-gray-300"); // Re-add default border
    handleFiles(event.dataTransfer.files);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedFile) return;
    const formData = new FormData();
    console.log("Submitting file:", selectedFile);
    formData.append("file", selectedFile);
    const response = fetch(`${API_URL}/user/upload`, {
      method: "POST",
      body: formData,
      credentials: "include", // Include cookies for session management
    });
    response
      .then((res) => {
        if (!res.ok) {
          throw new Error("File upload failed");
        }
        window.location.reload();
        return res.json();
      })
      .then((data) => {
        console.log("File uploaded successfully:", data);
        // Optionally, reset the form or show a success message
        setSelectedFile(null);
        document.getElementById("uploadForm").reset();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again.");
      });
  };

  return (
    // This component now only renders the upload specific elements
    // The page-header h1 is handled in Dashboard.jsx
    <div className="w-full flex justify-center py-4">
      {" "}
      {/* upload-section equivalent */}
      <div className="w-full max-w-2xl px-4">
        {" "}
        {/* upload-container equivalent, max-w-2xl is 48rem/768px */}
        <div
          className="
          bg-white p-8 rounded-lg shadow-md text-center
          dark:bg-gray-800 dark:shadow-lg dark:text-gray-100
        "
        >
          {" "}
          {/* upload-card-alt equivalent */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 dark:text-white">
            Upload your files
          </h2>
          <p className="text-gray-600 text-sm mb-6 dark:text-gray-400">
            File should be PDF only
          </p>{" "}
          {/* file-type-info-alt equivalent */}
          <form id="uploadForm" onSubmit={handleSubmit}>
            <div
              className="
                border-3 border-dashed border-gray-300 rounded-lg p-10 cursor-pointer relative overflow-hidden mb-6
                hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 ease-in-out
                dark:border-gray-600 dark:hover:border-blue-400 dark:hover:bg-gray-700
              " /* drag-drop-area-alt equivalent */
              id="dragDropArea"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon
                icon={faFolder}
                className="text-5xl text-blue-500 mb-4 dark:text-blue-400"
              />{" "}
              {/* folder-icon-alt equivalent */}
              <p className="text-gray-700 text-lg dark:text-gray-300">
                Drag & Drop your PDF file here
              </p>
              <input
                type="file"
                id="fileInput"
                name="file"
                accept="application/pdf"
                onChange={handleFileInputChange}
                required
                className="
                  absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10
                  text-0 p-0 m-0 leading-none whitespace-nowrap {/* Hide default browser text */}
                "
              />
            </div>

            {selectedFile && (
              <div className="text-left mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                {" "}
                {/* selected-files-section equivalent */}
                <h3 className="text-lg font-medium text-gray-800 mb-4 dark:text-white">
                  Selected File:
                </h3>
                <ul id="fileList" className="space-y-3">
                  {" "}
                  {/* file-list equivalent */}
                  <li
                    className="
                    flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md py-3 px-4
                    text-gray-700 text-base
                    dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200
                  "
                  >
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="mr-3 text-red-500 dark:text-red-400"
                    />
                    <span>{selectedFile.name}</span>
                    <span className="text-gray-500 text-sm ml-auto dark:text-gray-400">
                      ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </span>
                    <button
                      className="text-red-500 text-2xl leading-none ml-4 hover:text-red-700 transition-colors duration-200 dark:hover:text-red-300" /* remove-file equivalent */
                      type="button"
                      onClick={handleRemoveFile}
                    >
                      &times;
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button
              className={`
                flex items-center justify-center px-8 py-3 rounded-md font-semibold text-lg mt-8 w-full
                transition-all duration-300 ease-in-out
                ${
                  !selectedFile
                    ? "bg-gray-400 cursor-not-allowed opacity-70"
                    : "bg-green-600 text-white hover:bg-green-700"
                }
                dark:text-white ${
                  !selectedFile
                    ? "dark:bg-gray-600"
                    : "dark:bg-green-700 dark:hover:bg-green-800"
                }
              `} /* upload-button equivalent */
              id="uploadButton"
              type="submit"
              disabled={!selectedFile}
            >
              <FontAwesomeIcon icon={faUpload} className="mr-3" /> Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadDocument;
