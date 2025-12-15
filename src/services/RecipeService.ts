// src/services/RecipeService.ts

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  instructions?: string[];
  ingredients?: string[];
  structuredIngredients?: {
    name: string;
    amount: string;
    isAvailable: boolean;
  }[];
}

import { GoogleGenerativeAI } from '@google/generative-ai';

export const findRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  if (ingredients.length === 0) {
    return [];
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API_KEY is not set');
    return [];
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

  const prompt = `Suggest 5 recipes using these ingredients: ${ingredients.join(', ')}. 
  Return a JSON array with objects containing 'strMeal' (name) and 'idMeal' (unique id, can be random string). 
  Do not include markdown formatting like \`\`\`json. Just return the raw JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up potentially markdown-wrapped response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const recipes = JSON.parse(jsonStr);

    return recipes.map((recipe: any) => ({
      idMeal: recipe.idMeal || Math.random().toString(36).substring(7),
      strMeal: recipe.strMeal,
      strMealThumb: `https://placehold.co/600x400?text=${encodeURIComponent(recipe.strMeal)}`
    }));
  } catch (error) {
    console.error('Error fetching recipes from Gemini:', error);
    return [];
  }
};

export const getRecipeDetails = async (recipeName: string, availableIngredients: string[]): Promise<Recipe | null> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('API_KEY is not set');
    return null;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

  const prompt = `Provide step-by-step cooking instructions for the recipe "${recipeName}" using these available ingredients: ${availableIngredients.join(', ')}.
  
  Return a JSON object with:
  - 'strMeal' (name)
  - 'structuredIngredients': Array of objects, each having:
    - 'name': Ingredient name
    - 'amount': Quantity/Measurement
    - 'isAvailable': boolean (true if the ingredient is present in the provided list: [${availableIngredients.join(', ')}], false otherwise)
    - 'original': String representation (e.g. "2 Tomatoes")
  - 'instructions' (array of strings for each step)
  - 'idMeal' (random string if needed)
  
  Be smart about matching ingredients. If user has "Tomato", then "Cherry Tomatoes" or "Tomato Paste" might be considered related but strictly speaking, check if they can make it. 
  However, for 'isAvailable', be generous: if they have the main component, set it to true.
  
  Do not include markdown formatting. Just raw JSON.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};
