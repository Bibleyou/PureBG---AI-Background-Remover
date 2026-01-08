import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.34.0";

/**
 * Usa o modelo Gemini 2.5 Flash Image para remover o fundo.
 * O modelo é instruído a colocar o objeto em fundo branco puro (#FFFFFF).
 * Em seguida, o código remove o branco para gerar transparência real.
 */
export async function removeBackground(base64Image: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    throw new Error("API KEY NÃO CONFIGURADA: Vá em 'Settings > Environment Variables' na Vercel, adicione 'API_KEY' e faça o 'Redeploy'.");
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
            text: 'Extract the main subject from this image. Place the subject on a solid, perfectly pure white background (#FFFFFF). Remove all shadows, reflections, and other background elements. Ensure the subject edges are sharp. Return ONLY the resulting image.'
          },
        ],
      },
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("A IA não retornou uma resposta. Tente novamente.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const resultBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        // Converte o fundo branco gerado pela IA em transparência real no navegador
        return await makeWhiteTransparent(resultBase64);
      }
    }

    throw new Error("Não foi possível processar esta imagem específica. Tente outra.");
  } catch (error: any) {
    console.error("Erro Gemini:", error);
    
    if (error.status === 429) {
      throw new Error("Limite da API Gratuita atingido. Aguarde um minuto e tente novamente.");
    }
    
    if (error.message?.includes("API_KEY")) {
      throw new Error("Chave de API inválida ou não configurada corretamente.");
    }
    
    throw new Error(error.message || "Ocorreu um erro na comunicação com a IA.");
  }
}

/**
 * Algoritmo para tornar o fundo branco puro (#FFFFFF) transparente.
 */
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
      
      // Sensibilidade para remover o branco (240-255)
      const threshold = 240;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Se a cor for próxima ao branco puro, torna o pixel transparente (alpha = 0)
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Erro ao processar a transparência da imagem."));
    img.src = dataUrl;
  });
}