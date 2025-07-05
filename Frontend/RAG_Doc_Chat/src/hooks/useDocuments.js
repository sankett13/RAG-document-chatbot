import { useState, useEffect } from "react";
import { documentAPI } from "../services/api";

export const useDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await documentAPI.getDocuments();

      if (response.success) {
        setDocuments(response.documents);
      } else {
        setError(response.message || "Failed to fetch documents");
      }
    } catch (err) {
      setError("Failed to fetch documents. Please try again.");
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to upload a document
  const uploadDocument = async (file) => {
    try {
      setError(null);

      const response = await documentAPI.uploadDocument(file);

      if (response.success) {
        // Refresh the documents list after successful upload
        await fetchDocuments();
        return response;
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload document. Please try again.");
      console.error("Error uploading document:", err);
      throw err;
    }
  };

  // Fetch documents on component mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    setError, // Allow components to clear errors
  };
};

export default useDocuments;
