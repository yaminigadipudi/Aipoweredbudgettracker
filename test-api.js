import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyCamPnJ4u03jnuDe7eb5dcCIcJYv9Tmsis';

async function testAPI() {
  try {
    console.log('Testing API key...');
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Try different models
    const models = ['gemini-pro', 'gemini-1.5-flash', 'gemini-1.5-pro'];
    
    for (const modelName of models) {
      try {
        console.log(`\nTrying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello, how are you?');
        const response = await result.response;
        const text = response.text();
        console.log(`✅ ${modelName} works:`, text.substring(0, 100));
        break;
      } catch (error) {
        console.log(`❌ ${modelName} failed:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}

testAPI();