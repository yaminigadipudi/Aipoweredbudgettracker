import fetch from 'node-fetch';

async function listModels() {
  const apiKey = process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    console.error('Gemini API key not found');
    return;
  }

  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'Authorization': 'Bearer ' + apiKey },
    });

    if (!res.ok) {
      console.error('Failed to fetch models:', await res.text());
      return;
    }

    const data = await res.json();
    if (data.models) {
      console.log('Available models:');
      data.models.forEach((model: { name: string; displayName: string }) => {
        console.log('- Name: ' + model.name + ', Display Name: ' + model.displayName);
      });
    } else {
      console.log('No models found in response:', data);
    }
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

listModels();
