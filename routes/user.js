const express = require("express");
const multer = require("multer");
const router = express.Router();
const File = require("../models/files");
const rag_process = require("../utils/rag_process"); // Utility for processing files
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} = require("@langchain/google-genai");
const { PromptTemplate } = require("@langchain/core/prompts");

// Singleton for Vector Store and Retriever
let vectorStore = null;
let retriever = null;

// Function to initialize Vector Store and Retriever
async function initializeVectorStore(filePath) {
  const documents = await rag_process.processPDF(filePath);
  console.log(`Number of documents loaded: ${documents.length}`);
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
  });
  console.log(`Number of documents loaded: ${documents.length}`);

  vectorStore = await MemoryVectorStore.fromDocuments(documents, embeddings);
  retriever = vectorStore.asRetriever({
    searchType: "mmr",
    searchParams: {
      k: 5, // Number of documents to retrieve
      lambda: 0.5, // MMR lambda parameter
    },
  });
  console.log(vectorStore);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Route: Dashboard
router.get("/dashboard", async (req, res) => {
  const documents = await File.find({ user: req.user.id });
  res.render("user_dashboard", {
    user: req.user,
    documents: documents,
    activePage: "dashboard",
  });
});

// Route: Get Documents API
router.get("/api/documents", async (req, res) => {
  try {
    const documents = await File.find({ user: req.user.id }).select(
      "filename createdAt _id "
    );

    // Trim the filename for each document
    const trimmedDocuments = documents.map((doc) => ({
      _id: doc._id,
      filename:
        doc.filename.length > 20
          ? doc.filename.substring(14, 25) + "..."
          : doc.filename,
      createdAt: doc.createdAt,
    }));

    res.json({
      success: true,
      documents: trimmedDocuments,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching documents",
    });
  }
});

// Route: Upload Page
router.get("/upload", async (req, res) => {
  res.render("upload", { user: req.user, activePage: "upload" });
});

// Route: Upload File
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  console.log("uploading file");
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = file.path;
  const user = req.user;

  const newFile = await File.create({
    user: user.id,
    filename: file.filename,
  });

  if (newFile) {
    try {
      await initializeVectorStore(filePath);
      console.log("Vector store initialized successfully");
      res.json({
        success: true,
        message: "File uploaded and processed successfully",
        fileId: newFile._id,
      });
    } catch (error) {
      console.error("Error initializing vector store:", error);
      return res.status(500).send("Error processing file");
    }
  } else {
    console.error("Error uploading file");
    res.status(500).send("Error uploading file");
  }
});

// Route: Ask Question
router.post("/ask", async (req, res) => {
  const { question } = req.body;
  console.log("Received question:", question);

  if (!retriever) {
    return res
      .status(500)
      .send("Vector store is not initialized. Please upload a file first.");
  }

  try {
    const retrievedDocuments = await retriever.getRelevantDocuments(question);
    const retrievedContent = retrievedDocuments
      .map((doc) => doc.pageContent)
      .join("\n");
    console.log("Documents retrieved:", retrievedDocuments.length);
    console.log("Retrieved content:", retrievedContent);

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
    });

    const prompt = PromptTemplate.fromTemplate(
      `Answer the question based on the context provided below. If the answer is not in the context, say "I don't know".\n\nContext:\n{context}\n\nQuestion: {question}.Only just answer the question, do not include any additional information but frame the answer in a way that it is understandable to the user and frame it according to your language.`
    );

    const formattedPrompt = await prompt.format({
      context: retrievedContent,
      question: question,
    });

    const response = await llm.invoke(formattedPrompt);
    console.log("Response from LLM:", response.text);

    res.json({ answer: response.text });
  } catch (error) {
    console.error("Error retrieving documents or invoking LLM:", error);
    res.status(500).send("Error processing question");
  }
});

router.get("/document/:id", (req, res) => {
  console.log("Fetching document with ID:", req.params.id);
  res.render("chat_doc", {
    user: req.user,
    selectedDocId: req.params.id,
    selectedDocName: req.query.name || "Document",
    activePage: "chat",
  });
});

router.post("/logout", (req, res) => {
  console.log("User logged out");
  // Clear the token cookie
  res.clearCookie("token");
  res.redirect("/login");
});

module.exports = router;
