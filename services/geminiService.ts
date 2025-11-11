
import { GoogleGenAI } from '@google/genai';
import type { AspectRatio } from '../types';

const POLLING_INTERVAL_MS = 10000; // 10 seconds

export const generateSceneVideo = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API key is not configured. Please select an API key.");
    }

    // Create a new instance for each call to ensure the latest key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    console.log(`Starting video generation for prompt: "${prompt}" with aspect ratio: ${aspectRatio}`);

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio,
        }
    });

    console.log("Initial operation created:", operation);

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
        console.log("Polling for video generation status...");
        operation = await ai.operations.getVideosOperation({ operation: operation });
        console.log("Current operation status:", operation);
    }

    if (operation.error) {
        console.error("Video generation failed with an error:", operation.error);
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        console.error("Video generation finished, but no download link was found.", operation.response);
        throw new Error("Video generation completed, but no video URL was returned.");
    }
    
    // The download link requires the API key to be appended for access
    const finalUrl = `${downloadLink}&key=${process.env.API_KEY}`;
    console.log("Video generated successfully. Final URL:", finalUrl);

    return finalUrl;
};
