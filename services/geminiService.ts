
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
    return JSON.parse(response.text);
  } catch (error) {
    return {
      description: "A fresh new track from buybeatz.",
      tags: [genre, "new", "beat"],
      suggestedBpm: 120
    };
  }
};

export const generateBlogPost = async (title: string, genre: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a professional 200-word "Behind the Beat" blog post for a music producer's website. 
      Track Title: ${title}
      Genre: ${genre}
      Vibe: ${description}
      Make it inspiring for other artists to use this beat.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            blogTitle: { type: Type.STRING },
            content: { type: Type.STRING }
          },
          required: ["blogTitle", "content"]
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return {
      blogTitle: `Creating ${title}: A Deep Dive`,
      content: `This track was inspired by the unique energy of ${genre} music. It features heavy atmosphere and professional mixing...`
    };
  }
};
