type DeepSeekResponse = any;

const DEFAULT_API_URL = import.meta.env.VITE_DEEPSEEK_API_URL ?? "https://api.deepseek.com/v1/chat/completions";

export async function askDeepSeek(question: string): Promise<DeepSeekResponse> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_DEEPSEEK_API_KEY no está configurada en .env");
  }

  const url = DEFAULT_API_URL;
  console.log("DeepSeek request:", { url, question });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: question,
          },
        ],
        max_tokens: 1024,
      }),
    });

    const data = await res.json();
    console.log("DeepSeek response:", data);

    if (!res.ok) {
      const errorMsg = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(`DeepSeek API error: ${errorMsg}`);
    }

    return data?.choices?.[0]?.message?.content || data;
  } catch (err: any) {
    console.error("DeepSeek error:", err);
    throw err;
  }
}

export async function askDeepSeekForTicket(fileName: string): Promise<DeepSeekResponse> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_DEEPSEEK_API_KEY no está configurada en .env");
  }

  const url = DEFAULT_API_URL;
  const prompt = `Eres un experto en facturación. Analiza este archivo de ticket: ${fileName}. Extrae: 1) establecimiento (nombre), 2) monto (número), 3) rfc_emisor (string), 4) folio_referencia (número o string), 5) url_facturacion (URL si existe). Responde en JSON con esas 5 claves exactas.`;

  console.log("DeepSeek ticket request:", { url, fileName });

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1024,
      }),
    });

    const data = await res.json();
    console.log("DeepSeek ticket response:", data);

    if (!res.ok) {
      const errorMsg = data?.error?.message || `HTTP ${res.status}`;
      throw new Error(`DeepSeek API error: ${errorMsg}`);
    }

    return data?.choices?.[0]?.message?.content || data;
  } catch (err: any) {
    console.error("DeepSeek ticket error:", err);
    throw err;
  }
}
