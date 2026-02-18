
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTrackDetails = async (title: string, genre: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling marketing description and 5 relevant tags for a music track titled "${title}" in the genre "${genre}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedBpm: { type: Type.NUMBER }
          },
          required: ["description", "tags", "suggestedBpm"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return {
      description: "A professional production from the buybeatz collective.",
      tags: [genre, "premium", "buybeatz"],
      suggestedBpm: 140
    };
  }
};
