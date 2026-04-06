import { GoogleGenAI } from "@Google/Genai";
import { log } from "console";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

export const analyzeImage = async (filePath: string) => {
  try {

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const base64ImageFile = fs.readFileSync(filePath, {
      encoding: "base64",
    });

    const contents = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64ImageFile,
        },
      },
      {
        text: "Extract the food name and estimates calories from this image in a JSON object.",
      },
    ];

    const config = {
      responseMimeType: "application/json",
      responseJsonSchema: {
        type: "object",
        properties: {
          name: { type: "string" },
          calories: { type: "number" },
        },
      },
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config,
    });

    //response.text shold be valid json matching the schma
    return JSON.parse(response.text);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
