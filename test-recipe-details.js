
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.API_KEY;
if (!apiKey) {
    console.error('API_KEY is not set');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro-latest' });

async function testRecipeDetails() {
    const recipeName = "Chicken Curry";
    const ingredients = ["chicken", "curry powder", "coconut milk", "onion"];

    console.log(`Getting details for ${recipeName}...`);

    const prompt = `Provide step-by-step cooking instructions for the recipe "${recipeName}" using these available ingredients: ${ingredients.join(', ')}.
    Return a JSON object with:
    - 'strMeal' (name)
    - 'structuredIngredients': Array of objects, each having:
        - 'name': Ingredient name
        - 'amount': Quantity/Measurement
        - 'isAvailable': boolean (true if the ingredient is present in the provided list: [${ingredients.join(', ')}], false otherwise)
        - 'original': String representation (e.g. "2 Tomatoes")
    - 'instructions' (array of strings for each step)
    - 'idMeal' (random string if needed)
    
    Be smart about matching ingredients.
    Do not include markdown formatting. Just raw JSON.`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Response:", text);

        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const details = JSON.parse(jsonStr);
        console.log("Parsed Details:", details);

    } catch (error) {
        console.error('Error:', error);
    }
}

testRecipeDetails();
