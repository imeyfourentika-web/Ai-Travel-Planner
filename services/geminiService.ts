import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ItineraryResponse, TripInput } from "../types";

// Define the schema for structured JSON output
const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    tripTitle: {
      type: Type.STRING,
      description: "A catchy title for the trip.",
    },
    currencyCode: {
      type: Type.STRING,
      description: "The currency code requested by the user (e.g., JPY, USD, IDR).",
    },
    dailyPlans: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: {
            type: Type.STRING,
            description: "Main theme or focus of the day.",
          },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                openingHours: {
                  type: Type.STRING,
                  description: "Opening and closing time (e.g. 09:00 - 17:00)",
                },
                estimatedCost: {
                  type: Type.STRING,
                  description: "Cost estimate string for display (e.g. '¥2000' or 'Free').",
                },
                price: {
                  type: Type.NUMBER,
                  description: "Numeric value of the cost in the requested currency. Use 0 if Free.",
                },
                category: {
                  type: Type.STRING,
                  description: "Category like Food, History, Nature, Shopping.",
                },
                imagePrompt: {
                   type: Type.STRING,
                   description: "A short, descriptive English search term to find a photo of this place (e.g., 'Eiffel Tower Paris sunny' or 'Sushi platter').",
                }
              },
              required: ["name", "description", "openingHours", "estimatedCost", "price", "category", "imagePrompt"],
            },
          },
        },
        required: ["dayNumber", "theme", "activities"],
      },
    },
  },
  required: ["tripTitle", "currencyCode", "dailyPlans"],
};

export const generateItinerary = async (input: TripInput): Promise<ItineraryResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Buatkan rencana perjalanan wisata (itinerary) yang detail untuk ${input.destination}.
    Durasi perjalanan adalah ${input.duration} hari.
    Ketertarikan/Minat utama: ${input.interests}.
    
    BUDGET USER: ${input.budget} ${input.currency} untuk seluruh perjalanan.
    
    INSTRUKSI PENTING: 
    1. Sesuaikan rekomendasi aktivitas, transportasi lokal, dan tempat makan agar TOTAL estimasi biaya mendekati atau di bawah budget user.
    2. SANGAT PENTING: Gunakan mata uang '${input.currency}' untuk semua estimasi harga (price dan estimatedCost). Jangan gunakan mata uang lokal destinasi jika berbeda dengan '${input.currency}'. (Contoh: Jika user pilih IDR ke Jepang, output harga dalam IDR).
    3. Jika aktivitas gratis, isi price dengan 0.
    4. Untuk 'imagePrompt', berikan kata kunci bahasa Inggris yang spesifik untuk visualisasi tempat tersebut.
    
    Berikan output dalam format JSON yang valid sesuai skema yang diminta.
    Pastikan:
    1. Field 'price' harus berupa angka murni (number) dalam mata uang ${input.currency}.
    2. Jam buka/tutup akurat atau estimasi yang wajar.
    3. Nama tempat spesifik.
    4. Deskripsi singkat namun menarik.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4, 
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI.");
    }

    const data = JSON.parse(text) as ItineraryResponse;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};