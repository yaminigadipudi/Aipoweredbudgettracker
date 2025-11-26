import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCShRTNHS3u8ju4PNe6aPzr26txjmpN2Gg';
const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });
    const result = await model.generateContent('Hello, how are you?');
    const response = await result.response;
    console.log('Success:', response.text());
  } catch (error) {
    console.error('Error:', error);
  }
}

testGemini();