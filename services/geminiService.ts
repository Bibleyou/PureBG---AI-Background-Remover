import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.34.0";

/**
 * Uses Gemini 2.5 Flash Image model to perform background removal.
 * The model is instructed to place the subject on a pure white background.
 * Then the browser converts that white to transparent.
 */
export async function removeBackground(base64Image: string): Promise<string> {
  // Acesso direto via process.env que é injetado pelo sistema de build
  let apiKey = "";
  
  try {
    // Tenta diferentes formas de acesso para garantir compatibilidade com ambientes Vercel/Vite
    apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
             (import.meta as any).env?.VITE_API_KEY || 
             "";
  } catch (e) {
    console.warn("Ambiente não suporta process.env clássico, tentando alternativas...");
  }

  // Se ainda estiver vazio, mas existir a string "undefined" injetada
  if (!apiKey || apiKey === "undefined") {
     throw new Error(
      "API KEY NÃO DETECTADA: Siga estes 3 passos:\n" +
      "1. Na Vercel, em 'Settings > Environment Variables', o nome deve ser exatamente API_KEY.\n" +
      "2. Clique em 'Save'.\n" +
      "3. Vá na aba 'Deployments', clique nos 3 pontinhos do último deploy e selecione 'REDEPLOY'. Sem isso, o código antigo continua rodando sem a chave."
    );
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
            text: 'Isolate the main subject. Remove all background. Place the subject on a solid #FFFFFF white background. Ensure clean and sharp edges. Return only the image.'
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

    throw new Error("A IA processou, mas não retornou os dados da imagem. Tente novamente.");
  } catch (error: any) {
    console.error("Gemini Error:", error);
    
    // Tratamento específico para erros comuns da API
    if (error.status === 403) throw new Error("A chave de API não tem permissão para este modelo. Verifique se é uma chave do Google AI Studio.");
    if (error.status === 429) throw new Error("Limite de uso atingido (Rate Limit). Aguarde 60 segundos.");
    
    throw new Error(error.message || "Erro na comunicação com a Inteligência Artificial.");
  }
}

/**
 * Local process to turn pure white pixels into transparency.
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
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const threshold = 242; // Sensibilidade para o branco

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > threshold && g > threshold && b > threshold) {
          data[i + 3] = 0; // Torna transparente
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Erro ao finalizar a transparência da imagem."));
    img.src = dataUrl;
  });
}