import { GoogleGenAI } from "@google/genai";

/**
 * Uses Gemini 2.5 Flash Image model to perform background removal.
 */
export async function removeBackground(base64Image: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("Chave API não encontrada. Adicione a variável 'API_KEY' nas configurações da Vercel (Settings > Environment Variables) e faça um novo Deploy.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const mimeType = base64Image.split(';')[0].split(':')[1];
  const imageData = base64Image.split(',')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData,
              mimeType: mimeType,
            },
          },
          {
            text: 'Extract the main subject from this image. Remove everything else. Return only the subject on a solid, pure #FFFFFF white background. Ensure the edges are sharp and clean. Do not add any text or borders.'
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("A IA não retornou uma resposta válida.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const resultBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return await makeWhiteTransparent(resultBase64);
      }
    }

    throw new Error("A IA não conseguiu processar a imagem. Tente uma foto com fundo mais simples.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.message?.includes("entity was not found")) {
      throw new Error("Modelo não encontrado. Verifique se sua chave de API tem acesso ao gemini-2.5-flash-image.");
    }
    throw error;
  }
}

async function makeWhiteTransparent(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const threshold = 245;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Erro ao processar transparência da imagem."));
    img.src = dataUrl;
  });
}