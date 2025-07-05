import { GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI } from "@langchain/google-genai";


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "AIzaSyAerN0hPWMN0E3yLbDlPBnBV24Q-o6acaw",
});


const ans = await llm.invoke("What is the capital of France?");
console.log(ans.text); 