
import { GoogleGenAI } from "@google/genai";

export const analyzeLogWithGemini = async (logData: string, context: string = "security"): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: Gemini API Key is missing. Please check your environment variables.";
  }

  // Fix: Initializing GoogleGenAI inside the function to follow latest instantiation guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const prompt = `
      You are an expert Senior Security Operations Center (SOC) Analyst and Threat Hunter. 
      Your task is to analyze the following ${context} data.
      
      STRICT OUTPUT FORMAT (Markdown):
      
      ## Executive Summary
      [Brief high-level overview of findings]

      ## Technical Analysis
      - **Suspicious Indicators:** [List IP addresses, payloads, or error codes]
      - **Attack Vector:** [Identify the likely attack type, e.g., SQLi, Brute Force, DDoS]
      - **Severity:** [CRITICAL / HIGH / MEDIUM / LOW]

      ## Mitigation Strategy
      [Actionable steps to block or remediate the threat]

      Data to Analyze:
      ${logData}
    `;

    // Fix: Using 'gemini-3-pro-preview' for complex reasoning tasks (log analysis) as per task type selection rules
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Failed to connect to Gemini API. Please try again later.";
  }
};

export const askGemini = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Error: Gemini API Key is missing.";
  }

  // Fix: Initializing GoogleGenAI inside the function to follow latest instantiation guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Fix: Using 'gemini-3-flash-preview' for general simple text Q&A tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are the embedded AI assistant of a Kali Linux security distribution. You are concise, technical, and professional. Respond in a CLI-friendly format. Do not use markdown code blocks for simple text responses.",
      }
    });

    return response.text || "No response from AI.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Connection to Neural Engine failed.";
  }
};
