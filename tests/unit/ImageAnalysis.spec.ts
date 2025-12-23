// tests/unit/ImageAnalysis.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyzeImage } from '@/services/ImageAnalysis';

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

// Mock global fetch
global.fetch = vi.fn();

describe('ImageAnalysis', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default successful fetch mock
        (global.fetch as any).mockResolvedValue({
            blob: () => Promise.resolve(new Blob(['test-image'], { type: 'image/jpeg' }))
        });

        // Default Gemini mock
        mockGenerateContent.mockResolvedValue({
            response: {
                text: () => JSON.stringify(['Tomato', 'Onion'])
            }
        });
    });

    it('analyzes image and returns ingredients', async () => {
        const ingredients = await analyzeImage('test-image-url');

        expect(ingredients).toEqual(['Tomato', 'Onion']);
        expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro-latest' });
        expect(global.fetch).toHaveBeenCalledWith('test-image-url');
    });

    it('returns empty array if API fails', async () => {
        mockGenerateContent.mockRejectedValue(new Error('API Error'));

        const ingredients = await analyzeImage('test-image-url');
        expect(ingredients).toEqual([]);
    });

    it('returns empty array if fetch fails', async () => {
        (global.fetch as any).mockRejectedValue(new Error('Network Error'));

        const ingredients = await analyzeImage('test-image-url');
        expect(ingredients).toEqual([]);
    });
});
