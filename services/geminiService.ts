
import { GoogleGenAI, Type } from "@google/genai";

// The API key must be obtained exclusively from process.env.API_KEY.
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
            description: {
              type: Type.STRING,
              description: 'A catchy 2-sentence description for the track.'
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '5 relevant tags.'
            },
            suggestedBpm: {
              type: Type.NUMBER,
              description: 'A typical BPM for this genre.'
            }
          },
          required: ["description", "tags", "suggestedBpm"]
        }
      }
    });

    // Access the text property directly (not a method).
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating track details:", error);
    return {
      description: "A fresh new track from buybeatz.",
      tags: [genre, "new", "beat"],
      suggestedBpm: 120
    };
  }
};
