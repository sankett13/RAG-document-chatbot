// Simple example of how to fetch documents from the API

import { documentAPI } from "../services/api";

// Example 1: Basic fetch documents
export const fetchDocumentsExample = async () => {
  try {
    const response = await documentAPI.getDocuments();

    if (response.success) {
      console.log("Documents:", response.documents);
      return response.documents;
    } else {
      console.error("Failed to fetch documents:", response.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
};

// Example 2: Using in a React component with useState
import React, { useState, useEffect } from "react";

export const SimpleDocumentsComponent = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await documentAPI.getDocuments();

        if (response.success) {
          setDocuments(response.documents);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>My Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc._id}>
              {doc.filename} - {new Date(doc.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Example 3: Upload a document
export const uploadDocumentExample = async (file) => {
  try {
    const response = await documentAPI.uploadDocument(file);

    if (response.success) {
      console.log("Upload successful:", response);
      return response;
    } else {
      console.error("Upload failed:", response.message);
      throw new Error(response.message);
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Example 4: Ask a question about documents
export const askQuestionExample = async (question) => {
  try {
    const response = await documentAPI.askQuestion(question);
    console.log("Answer:", response.answer);
    return response.answer;
  } catch (error) {
    console.error("Error asking question:", error);
    throw error;
  }
};
