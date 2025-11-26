import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCShRTNHS3u8ju4PNe6aPzr26txjmpN2Gg';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:');
    for await (const model of models) {
      console.log('- ' + model.name);
    }
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();