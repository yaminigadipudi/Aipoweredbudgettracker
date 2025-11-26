import { GoogleGenerativeAI } from '@google/generative-ai';

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini API key not found");
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = await genAI.listModels();
    console.log("Available models:");
    models.forEach((model: any) => {
      console.log(`- Name: ${model.name}, Supported methods: ${model.supportedMethods?.join(", ")}`);
    });
  } catch (error) {
    console.error("Failed to list Gemini models:", error);
  }
}

listModels();
