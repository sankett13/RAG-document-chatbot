# Documents API Guide

This guide explains how to fetch and manage documents from your backend API in the React frontend.

## API Endpoints

The backend provides the following endpoints:

- `GET /user/api/documents` - Get all documents for the authenticated user
- `POST /user/upload` - Upload a new document
- `POST /user/ask` - Ask a question about the uploaded documents

## Setup

### 1. API Service (`src/services/api.js`)

The API service handles all HTTP requests to your backend:

```javascript
import { documentAPI } from "../services/api";

// Get all documents
const documents = await documentAPI.getDocuments();

// Upload a document
const result = await documentAPI.uploadDocument(file);

// Ask a question
const answer = await documentAPI.askQuestion("What is this document about?");
```

### 2. Custom Hook (`src/hooks/useDocuments.js`)

Use the `useDocuments` hook for state management:

```javascript
import useDocuments from "../hooks/useDocuments";

const MyComponent = () => {
  const { documents, loading, error, uploadDocument, fetchDocuments } =
    useDocuments();

  // documents - array of user's documents
  // loading - boolean indicating if API call is in progress
  // error - error message if something went wrong
  // uploadDocument - function to upload a new document
  // fetchDocuments - function to refresh the documents list
};
```

## Usage Examples

### Basic Document Fetching

```javascript
import React, { useState, useEffect } from "react";
import { documentAPI } from "../services/api";

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await documentAPI.getDocuments();
        if (response.success) {
          setDocuments(response.documents);
        }
      } catch (error) {
        console.error("Failed to load documents:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {documents.map((doc) => (
        <div key={doc._id}>
          <h3>{doc.filename}</h3>
          <p>Uploaded: {new Date(doc.createdAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};
```

### Upload Document

```javascript
const UploadComponent = () => {
  const { uploadDocument, loading, error } = useDocuments();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await uploadDocument(file);
        alert("Document uploaded successfully!");
      } catch (error) {
        alert("Upload failed: " + error.message);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} disabled={loading} />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};
```

### Ask Questions

```javascript
const QuestionComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAskQuestion = async () => {
    try {
      const response = await documentAPI.askQuestion(question);
      setAnswer(response.answer);
    } catch (error) {
      console.error("Error asking question:", error);
    }
  };

  return (
    <div>
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question about your documents"
      />
      <button onClick={handleAskQuestion}>Ask</button>
      {answer && <div>Answer: {answer}</div>}
    </div>
  );
};
```

## Document Object Structure

Each document object returned from the API has the following structure:

```javascript
{
  _id: "document_id",
  filename: "document.pdf",
  createdAt: "2025-06-29T10:00:00.000Z",
  user: "user_id"
}
```

## Error Handling

The API service includes built-in error handling:

- Network errors
- HTTP status errors
- Authentication errors (401)
- Server errors (500)

Always wrap API calls in try-catch blocks or use the error state from the `useDocuments` hook.

## Authentication

All API calls include credentials (cookies) automatically. Make sure your user is authenticated before making these calls.

## CORS Configuration

The backend is configured to accept requests from `http://localhost:5173` (your Vite dev server). If you change the frontend port, update the CORS configuration in `index.js`.
