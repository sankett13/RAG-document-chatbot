import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from "@langchain/google-genai";


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "API_KEY",
});


const ans = await llm.invoke("What is the capital of France?");
console.log(ans.text); 
