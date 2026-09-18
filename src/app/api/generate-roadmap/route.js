import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { interests } = await req.json();

    if (!interests || interests.length === 0) {
      return NextResponse.json({ error: "Missing interests selection matrix" }, { status: 400 });
    }

    const prompt = `You are a world-class professional career mentor. Analyze these interests: ${interests.join(", ")}.
    Create a detailed, actionable career pathway. 
    
    Return the response as a JSON array of objects. Each object MUST follow this structure:
    {
      "role": "Specific Career Role",
      "skills": "3-4 Core Competencies separated by commas",
      "roadmap": [
        {
          "phase": "Detailed Phase Title",
          "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
        },
        {
          "phase": "Next Level Phase Title",
          "steps": ["Step 1", "Step 2", "Step 3", "Step 4"]
        }
      ]
    }
    IMPORTANT: Provide at least 3 phases, each with at least 4 detailed, actionable steps. No markdown, no code blocks, only raw JSON.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      }
    );

    const aiData = await response.json();
    const rawText = aiData.candidates[0].content.parts[0].text.trim();
    const parsedData = JSON.parse(rawText);

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate detailed alignment map" }, { status: 500 });
  }
}