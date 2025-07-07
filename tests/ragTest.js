import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { PromptTemplate } from "@langchain/core/prompts";


const my_pdf = "./myResume.pdf";
const loader = new PDFLoader(my_pdf);
const documents = await loader.load();


console.log(`Number of documents loaded: ${documents.length}`);

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,      
    chunkOverlap: 30,   
    separators: ["\n\n", "\n", ".", "!", "?", " ", ""],
});

const splitDocuments = await textSplitter.splitDocuments(documents);

// console.log(splitDocuments);
console.log(`Number of split documents: ${splitDocuments.length}`);

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Resume Embeddings",
  apiKey: "API_KEY"
});

const embedDocuments = await embeddings.embedDocuments(splitDocuments.map(doc => doc.pageContent));
// Output the number of embeddings generated
console.log(`Number of embeddings generated: ${embedDocuments.length}`);


const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocuments,
  embeddings
);

const retriver = vectorStore.asRetriever({
    searchType: "similarity",
    searchK: 1,
});

const question = "What is my name?";
const retrieved_document = await retriver.getRelevantDocuments(
  question
);

const retrievedContent = retrieved_document.map(doc => doc.pageContent).join("\n");
console.log("Documents retrieved:", retrieved_document.length);

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "API_KEY",
});


const prompt = PromptTemplate.fromTemplate(`Answer the question based on the context provided below. If the answer is not in the context, say "I don't know".\n\nContext:\n{context}\n\nQuestion: {question}.Only just answer the question, do not include any additional information.`);

const formattedPrompt = await prompt.format({
  context: retrievedContent,
  question: question
});

const response = await llm.invoke(formattedPrompt);

console.log("Response from LLM:", response.text);
