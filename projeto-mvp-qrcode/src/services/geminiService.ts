import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY! 
});

export const generateLogo = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, minimalist, and clean logo for a business icon. The logo should be isolated on a solid white background, with no text, no shadows, and no complex gradients. Style: modern and flat. Subject: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    let base64Image: string | undefined;

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        base64Image = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!base64Image) {
      throw new Error("Não foi possível gerar a imagem. Nenhuma imagem retornada.");
    }

    return base64Image;
  } catch (error) {
    console.error("Erro ao gerar logotipo com Gemini:", error);
    throw error;
  }
};
