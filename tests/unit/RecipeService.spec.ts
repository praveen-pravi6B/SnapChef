// tests/unit/RecipeService.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findRecipesByIngredients } from '@/services/RecipeService';

// Mock the Gemini API
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
    generateContent: mockGenerateContent
}));

vi.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: vi.fn(() => ({
        getGenerativeModel: mockGetGenerativeModel
    }))
}));

describe('RecipeService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify([
                    { strMeal: 'Test Recipe 1', idMeal: '1' },
                    { strMeal: 'Test Recipe 2', idMeal: '2' }
                ])
            }
        });
    });

    it('generates recipes when ingredients are provided', async () => {
        const ingredients = ['tomato', 'onion'];
        const recipes = await findRecipesByIngredients(ingredients);

        expect(recipes).toHaveLength(2);
        expect(recipes[0].strMeal).toBe('Test Recipe 1');
        expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro-latest' });
    });

    it('returns empty array if no ingredients provided', async () => {
        const recipes = await findRecipesByIngredients([]);
        expect(recipes).toHaveLength(0);
        expect(mockGenerateContent).not.toHaveBeenCalled();
    });
});

import { findRecipesByLocation, getRecipeDetails } from '@/services/RecipeService';

describe('RecipeService - Location & Details', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock for specific tests if needed, basically defaults from parent describe block might not persist across describes unless carefully managed.
        // Re-declaring defaults here to be safe.
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify([
                    { strMeal: 'Local Test Recipe', idMeal: '3' }
                ])
            }
        });
    });

    it('finds recipes by location', async () => {
        const recipes = await findRecipesByLocation(40.7128, -74.0060, ['onion']);

        expect(recipes).toHaveLength(1);
        expect(recipes[0].strMeal).toBe('Local Test Recipe');
        // Check if prompt contained location info - checking abstractly via call arguments would be better if we could spy primarily on the prompt construction 
        // but checking the model was called is a good baseline.
        expect(mockGetGenerativeModel).toHaveBeenCalled();
    });

    it('gets recipe details', async () => {
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify({
                    strMeal: 'Test Recipe 1',
                    instructions: ['Step 1'],
                    structuredIngredients: []
                })
            }
        });

        const details = await getRecipeDetails('Test Recipe 1', ['tomato']);
        expect(details).toBeTruthy();
        expect(details?.strMeal).toBe('Test Recipe 1');
    });

    it('returns null for details on error', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API Error'));
        const details = await getRecipeDetails('Test Recipe 1', []);
        expect(details).toBeNull();
    });
});
