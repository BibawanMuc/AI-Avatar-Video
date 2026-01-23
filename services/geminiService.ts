
import { GoogleGenAI } from "@google/genai";
import { Outfit, Setting, Style, AspectRatio } from "../types";

export const generatePersonaImage = async (
  selfieBase64: string,
  outfit: Outfit,
  setting: Setting,
  style: Style,
  aspectRatio: AspectRatio
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not defined");
  const ai = new GoogleGenAI({ apiKey });

  // Clean base64 string
  const base64Data = selfieBase64.split(',')[1] || selfieBase64;

  const prompt = `Based on the provided selfie of this person, generate a high-quality professional image. 
  The person from the selfie should be clearly recognizable.
  - Outfit: The person should be wearing ${outfit}.
  - Setting: The person should be placed in a ${setting} environment.
  - Visual Style: Use a ${style} aesthetic.
  - Framing: The image should be a portrait or medium shot (waist up). DO NOT show the full body.
  Maintain the person's facial features and identity. Ensure realistic blending between the subject, the outfit, and the background.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image was returned from the AI model.");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
