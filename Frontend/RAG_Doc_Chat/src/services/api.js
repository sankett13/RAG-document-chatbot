// API service for making HTTP requests
const API_BASE_URL = "http://localhost:3000";

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const config = {
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Document-related API calls
export const documentAPI = {
  // Get all documents for the current user
  getDocuments: async () => {
    return makeRequest("/user/api/documents");
  },

  // Upload a new document
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    return makeRequest("/user/upload", {
      method: "POST",
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Ask a question about documents
  askQuestion: async (question) => {
    return makeRequest("/user/ask", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },
};

// Auth-related API calls
export const authAPI = {
  logout: async () => {
    return makeRequest("/user/logout", {
      method: "POST",
    });
  },
};

export default { documentAPI, authAPI };
