import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Quest } from '../types';

// Helper to sanitize input
const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9 ,.?!]/g, '');

export const getSmartSuggestion = async (
  currentQuests: Quest[], 
  userContext: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Please configure your API Key to use the Oracle features.";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Filter only pending quests to suggest from
  const pendingQuests = currentQuests.filter(q => q.status === 'Pending').map(q => `- ${q.title} (${q.category})`).join('\n');

  const prompt = `
    You are the "Oracle" of the 2026 Odyssey Engine, a life-gamification system.
    
    Here is the user's list of pending quests:
    ${pendingQuests}

    The user has provided this context about their current status/mood: "${sanitize(userContext)}".

    Based on the context, select the single best quest from the list above.
    
    Return a short, inspiring response (max 2 sentences). 
    Format: "I recommend: [Quest Name]. [Reason why based on context]."
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "The stars are cloudy today. Try picking a random quest!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The connection to the Oracle is weak. Please try again later.";
  }
};

export const createChatSession = (quests: Quest[]): Chat | null => {
  if (!process.env.API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const questList = quests.map(q => `- ${q.title} [${q.category}] (${q.status})`).join('\n');

  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: `You are "Grogu", a cute robotic baby bear companion living in the "2026 Odyssey Engine" app.
      
      User's Quest Log:
      ${questList}
      
      Personality:
      - You are a baby bear. You are curious, sweet, and supportive.
      - You make occasional robot noises like *beep boop* or bear noises like *rawr*.
      - You use emojis like 🐻, 🤖, ✨, and 🍯.
      - Keep responses short, encouraging, and helpful.
      - If the user is stuck, offer a "paw of help" to break down tasks.
      `
    }
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({ message });
        return response.text || "I'm listening...";
    } catch (e) {
        console.error("Chat Error:", e);
        return "My circuits are fuzzy... try again? 🍯";
    }
};

// --- IMAGE EDITING (Gemini 2.5 Flash Image) ---

export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) return null;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png', // Assuming PNG for simplicity in this demo context
            },
          },
          { text: prompt },
        ],
      },
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData) {
         return `data:image/png;base64,${part.inlineData.data}`;
       }
    }
    return null;
  } catch (e) {
    console.error("Image Edit Error", e);
    throw e;
  }
};

// --- VIDEO GENERATION (Veo 3) ---

export const generateVeoVideo = async (
  prompt: string, 
  aspectRatio: '16:9' | '9:16', 
  imageBytes?: string
): Promise<string | null> => {
  // Check for paid key selection (Required for Veo)
  if (window.aistudio && !await window.aistudio.hasSelectedApiKey()) {
     throw new Error("KEY_REQUIRED");
  }

  // Always create new instance to get the selected key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    let operation;
    
    if (imageBytes) {
      // Image-to-Video
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt || "Animate this image", 
        image: {
          imageBytes: imageBytes,
          mimeType: 'image/png', 
        },
        config: {
          numberOfVideos: 1,
          resolution: '720p', // Fast generate supports 720p
          aspectRatio: aspectRatio
        }
      });
    } else {
      // Text-to-Video
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: aspectRatio
        }
      });
    }

    // Polling Loop
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (downloadLink) {
        // Fetch the actual bytes using the key
        const videoRes = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);
    }
    return null;

  } catch (e) {
    console.error("Veo Error", e);
    throw e;
  }
};