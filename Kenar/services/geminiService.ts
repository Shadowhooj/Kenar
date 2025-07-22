
import { GoogleGenAI } from "@google/genai";

// Ensure the API key is available, but do not handle its input in the UI.
if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = "gemini-2.5-flash";

// Function to convert base64 data URL to the format Gemini expects
const fileToGenerativePart = (dataUrl: string) => {
    // Expected format: "data:image/jpeg;base64,LzlqLzRBQ... -> { mimeType, data }"
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match || match.length !== 3) {
        throw new Error("Invalid data URL format");
    }
    return {
        inlineData: {
            mimeType: match[1],
            data: match[2],
        },
    };
};

export const generateCaptionsForImage = async (base64ImageDataUrl: string): Promise<string[]> => {
    try {
        const imagePart = fileToGenerativePart(base64ImageDataUrl);
        const prompt = `
            You are an expert in writing short, witty, and poetic social media captions in Persian.
            Analyze this image and generate 3 creative caption options.
            The captions should be in Persian.
            Return the result as a JSON object with a single key "captions" which is an array of strings.
            Example: {"captions": ["کپشن اول", "کپشن دوم", "کپشن سوم"]}
        `;

        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                temperature: 0.8,
            },
        });
        
        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const parsedData = JSON.parse(jsonStr);
        if (parsedData && Array.isArray(parsedData.captions)) {
            return parsedData.captions;
        }
        
        console.warn("Could not find captions array in response, returning default.", parsedData);
        return ["یک روز زیبا!", "لحظه ها...", "خاطره ای برای همیشه"];

    } catch (error) {
        console.error("Error generating captions with Gemini:", error);
        // Provide fallback captions on error
        return ["خطا در تولید کپشن", "دوباره تلاش کنید", "یک عکس عالی"];
    }
};