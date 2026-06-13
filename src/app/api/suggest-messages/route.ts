import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const prompt = `
      Create a list of three open-ended and engaging questions formatted as a single string.
      Each question should be separated by '||'.
      Questions should be suitable for an anonymous social messaging platform.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({
      success: true,
      questions: response.text,
    });
  } catch (error:any) {
    console.error(error);

    if (error?.status === 429) {
    return NextResponse.json(
      {
        success: false,
        message: "AI usage limit reached. Please try again later.",
      },
      { status: 429 }
    );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate questions",
      },
      {
        status: 500,
      }
    );
  }
}