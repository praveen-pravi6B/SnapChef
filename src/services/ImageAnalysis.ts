// src/services/ImageAnalysis.ts
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Function to convert a file to a base64 encoded part.
async function fileToGenerativePart(file: File): Promise<Part> {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
}

export const analyzeImage = async (imageUrl: string): Promise<string[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

  const prompt = "Identify the ingredients in this image and return them as a JSON array of strings. For example: [\"ingredient1\", \"ingredient2\"]";

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], "image.jpg", { type: blob.type });
    const imagePart = await fileToGenerativePart(file);

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    // Clean the response to get only the JSON part
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const ingredients = JSON.parse(jsonText);
    return Array.isArray(ingredients) ? ingredients : [];
  } catch (error) {
    console.error('Error analyzing image with Gemini:', error);
    return [];
  }
};
