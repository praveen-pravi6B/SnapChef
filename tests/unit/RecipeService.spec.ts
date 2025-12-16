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
