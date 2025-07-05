import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { PromptTemplate } from "@langchain/core/prompts";
// import { MongoClient } from "mongodb";

/**
 * Process a PDF file, retrieve relevant documents, and get a response from LLM.
 * Also stores embeddings in MongoDB.
 * @param {string} filePath - Path to the PDF file.
 * @param {string} question - Question to ask the LLM.
 * @returns {Promise<string>} - Response from the LLM.
 */
async function processPDF(filePath) {
//   const mongoUri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
//   const dbName = "vectorDB"; // Database name
//   const collectionName = "file_embeddings"; // Collection name

//   const client = new MongoClient(mongoUri);

  try {
    // Connect to MongoDB
    // await client.connect();
    // const database = client.db(dbName);
    // const collection = database.collection(collectionName);

    // Load the PDF file
    const loader = new PDFLoader(filePath);
    const documents = await loader.load();
    console.log(`Number of documents loaded: ${documents.length}`);

    // Split the documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 512, // Larger chunks for more context
      chunkOverlap: 64, // Slightly more overlap for continuity
      separators: ["\n\n", "\n", ".", "!", "?", ";", ",", " "], // Added more granular separators
      keepSeparator: true, // Retain separators for better context
    });
    const splitDocuments = await textSplitter.splitDocuments(documents);
    console.log(`Number of split documents: ${splitDocuments.length}`);

    // Generate embeddings for the chunks
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Resume Embeddings",
      apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
    });
    // const embedDocuments = await embeddings.embedDocuments(splitDocuments.map(doc => doc.pageContent));
    // console.log(`Number of embeddings generated: ${embedDocuments.length}`);

    // Store embeddings in MongoDB
    // const embeddingData = splitDocuments.map((doc, index) => ({
    //   documentId: index + 1,
    //   pageContent: doc.pageContent,
    //   embedding: embedDocuments[index],
    // }));
    // const result = await collection.insertMany(embeddingData);
    // console.log(`Inserted ${result.insertedCount} embeddings into the database.`);

    // // Create a vector store and retriever
    // const vectorStore = await MemoryVectorStore.fromDocuments(splitDocuments, embeddings);
    // const retriever = vectorStore.asRetriever({
    //   searchType: "similarity",
    //   searchK: 1,
    // });

    // // Retrieve relevant documents based on the question
    // const question = "What is the candidate's experience in software development?";
    // const retrievedDocuments = await retriever.getRelevantDocuments(question);
    // const retrievedContent = retrievedDocuments.map(doc => doc.pageContent).join("\n");
    // console.log("Documents retrieved:", retrievedDocuments.length);

    // // Call the LLM with the retrieved content
    // const llm = new ChatGoogleGenerativeAI({
    //   model: "gemini-2.5-flash",
    //   apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
    // });
    // const prompt = PromptTemplate.fromTemplate(
    //   `Answer the question based on the context provided below. If the answer is not in the context, say "I don't know".\n\nContext:\n{context}\n\nQuestion: {question}.Only just answer the question, do not include any additional information.`
    // );
    // const formattedPrompt = await prompt.format({
    //   context: retrievedContent,
    //   question: question,
    // });
    // const response = await llm.invoke(formattedPrompt);

    console.log("returned splitDocuments:", splitDocuments.length);
    return splitDocuments; // Return split documents and embeddings for further processing
  } catch (error) {
    console.error("Error processing PDF:", error);
    throw error;
  } finally {
    // Close MongoDB connection
    // await client.close();
    console.log("finally block executed");
  }
}

// Export the processPDF function for use in other modules
export { processPDF };