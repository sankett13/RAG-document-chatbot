import { MongoClient } from "mongodb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

/**
 * Retrieve the most similar vector from the database based on a user query.
 * @param {string} query - The user's query.
 * @returns {Promise<object>} - The most similar document and its similarity score.
 */
async function retrieveSimilarVector(query) {
  const mongoUri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
  const dbName = "vectorDB"; // Database name
  const collectionName = "embeddings"; // Collection name

  const client = new MongoClient(mongoUri);

  try {
    // Connect to MongoDB
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Generate embedding for the query
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "text-embedding-004",
      apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
    });
    const queryEmbedding = await embeddings.embedQuery(query);

    // Fetch all embeddings from the database
    const storedEmbeddings = await collection.find().toArray();
    console.log("documents retrieved successfully");

    // Compute similarity scores
    const similarityScores = storedEmbeddings.map((doc) => {
      const dotProduct = queryEmbedding.reduce((sum, value, index) => sum + value * doc.embedding[index], 0);
      const queryMagnitude = Math.sqrt(queryEmbedding.reduce((sum, value) => sum + value ** 2, 0));
      const docMagnitude = Math.sqrt(doc.embedding.reduce((sum, value) => sum + value ** 2, 0));
      const cosineSimilarity = dotProduct / (queryMagnitude * docMagnitude);
      return { document: doc, similarity: cosineSimilarity };
    });

    // Sort by similarity score in descending order
    similarityScores.sort((a, b) => b.similarity - a.similarity);
    console.log("Similarity scores computed successfully");
    // Return the most similar document
    const mostSimilar = similarityScores[0];
    console.log("Most similar document found successfully" + mostSimilar);
    // console.log("Most similar document:", mostSimilar.document.pageContent);
    // console.log("Similarity score:", mostSimilar.similarity);


    const prompt = PromptTemplate.fromTemplate(
      `Answer the question based on the context provided below. If the answer is not in the context, say "I don't know".\n\nContext:\n{context}\n\nQuestion: {question}.Only just answer the question, do not include any additional information.`
    );

    const formattedPrompt = await prompt.format({
      context: mostSimilar.document.pageContent,
      question: query,
    });

    const llm = new GoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
    }); 
    const response = await llm.invoke(formattedPrompt);

    console.log("LLM response:", response.text);
    return response.text;
  } catch (error) {
    console.error("Error retrieving similar vector:", error);
    throw error;
  } finally {
    // Close MongoDB connection
    await client.close();
  }
}

// Export the retrieveSimilarVector function for use in other modules
export { retrieveSimilarVector };