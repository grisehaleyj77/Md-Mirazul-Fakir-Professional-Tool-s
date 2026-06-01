// Since we are running in the browser, we do not call the Gemini API directly from the client.
// Instead, we proxy all requests securely to the backend Express server. This keeps our API keys hidden and secured.
export const GEMINI_API_KEY = "server_side_managed";

export const ai = {
  models: {
    generateContent: async (params: any): Promise<{ text: string; candidates: any[] }> => {
      const response = await fetch("/api/gemini/generate-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch from Gemini API. Status: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.text || "",
        candidates: data.candidates || [
          {
            content: {
              parts: [{ text: data.text || "" }]
            }
          }
        ]
      };
    }
  }
};

