import { GoogleGenAI } from "@google/genai";

/**
 * Uses Gemini 2.5 Flash Image model to perform background removal.
 */
export async function removeBackground(base64Image: string): Promise<string> {
  // A API Key deve ser obtida exclusivamente de process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
            text: 'Isolate the main subject from the image. Remove all background elements. Place the subject on a solid #FFFFFF white background. Ensure clean and sharp edges. Return only the image.'
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("A IA não retornou uma imagem válida.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const resultBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        return await makeWhiteTransparent(resultBase64);
      }
    }

    throw new Error("A IA processou o pedido mas não gerou um arquivo de imagem.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    if (error.status === 403) throw new Error("Chave de API inválida ou sem permissões.");
    if (error.status === 429) throw new Error("Limite de cota atingido. Tente novamente em breve.");
    throw new Error(error.message || "Erro na comunicação com o Gemini AI.");
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
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const threshold = 245;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        // Se a cor for muito próxima de branco puro, torna transparente
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Erro ao gerar transparência."));
    img.src = dataUrl;
  });
}