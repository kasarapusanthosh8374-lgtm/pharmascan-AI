import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PrescriptionAnalysis } from "../types";

// Initialize Gemini client
// Note: API key is injected via process.env.API_KEY as per instructions
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const prescriptionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    patient_name: { type: Type.STRING, description: "Name of the patient if legible." },
    medications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          drug_name: { type: Type.STRING, description: "Name of the medication." },
          strength: { type: Type.STRING, description: "Dosage strength (e.g., 500mg)." },
          dosage_form: { type: Type.STRING, description: "Form (e.g., Tablet, Capsule)." },
          frequency: { type: Type.STRING, description: "How often to take (e.g., BID, once daily)." },
          duration: { type: Type.STRING, description: "How long to take (e.g., 7 days)." },
          clarity_status: { 
            type: Type.STRING, 
            enum: ["Clear", "Unclear"],
            description: "Whether the handwriting is legible and unambiguous." 
          },
          safety_warning: { type: Type.STRING, description: "Warnings for look-alike/sound-alike drugs or high dosages." },
        },
        required: ["drug_name", "clarity_status"],
      },
    },
    overall_risk_level: { 
      type: Type.STRING, 
      enum: ["Low", "Medium", "High"],
      description: "Assessment of risk based on clarity and drug types."
    },
    clarification_required: { type: Type.BOOLEAN, description: "True if the pharmacist must verify details." },
  },
  required: ["medications", "overall_risk_level", "clarification_required"],
};

export const analyzePrescriptionImage = async (base64Image: string, mimeType: string): Promise<PrescriptionAnalysis> => {
  try {
    const modelId = "gemini-2.5-flash"; // Capable of vision and JSON output

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `
            Analyze this handwritten prescription image for a pharmacist.
            
            Instructions:
            1. Identify all medication names, strengths, dosage form, frequency, and duration.
            2. If any medication name, dose, or instruction is unclear or ambiguous, mark it as "Unclear".
            3. Highlight look-alike or sound-alike drug risks (e.g., Losec vs Lasix).
            4. Do NOT guess unclear information.
            5. Use standard pharmacy terminology.
            `,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: prescriptionSchema,
        temperature: 0.1, // Low temperature for factual extraction
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as PrescriptionAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
