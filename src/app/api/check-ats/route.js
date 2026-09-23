import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

async function callGemini(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Server is missing GEMINI_API_KEY. Add it to your .env.local file.");
  }

  const response = await fetch(`${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini request failed (${response.status}): ${errText.slice(0, 200)}`);
  }

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  return raw;
}

function safeParseJSON(raw) {
  const cleaned = raw.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const role = (formData.get("role") || "").toString().trim();

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "Please attach a PDF resume." }, { status: 400 });
    }
    if (file.type && file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported right now." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const resumeText = (pdfData.text || "").trim();

    if (resumeText.length < 30) {
      return NextResponse.json(
        {
          error:
            "Couldn't extract readable text from this PDF. It may be a scanned image — try exporting a text-based PDF instead.",
        },
        { status: 422 }
      );
    }

    // Deterministic metadata computed from the real extracted text (not the model).
    const words = resumeText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const readingTime = `${Math.max(1, Math.round((wordCount / 200) * 10) / 10)} min`;
    const charsPerWord = resumeText.length / Math.max(1, wordCount);
    const scannability = wordCount < 120 ? "High-Risk" : charsPerWord > 9 ? "Medium-Risk" : "Low-Risk";

    const prompt = `
You are an expert ATS (Applicant Tracking System) resume auditor and technical recruiter.
${role ? `The candidate is targeting this role: "${role}".` : "No specific target role was given — evaluate generally for the seniority/field implied by the resume itself."}

Here is the raw text extracted from the candidate's resume PDF:
"""
${resumeText.slice(0, 12000)}
"""

Known facts (already computed, treat as ground truth — do not recompute them):
- word count: ${wordCount}
- estimated reading time: ${readingTime}
- scannability risk (from text density heuristics): ${scannability}

Analyze this resume like a rigorous ATS auditor. Respond with ONLY a raw JSON object (no markdown, no code fences, no commentary) in exactly this shape:

{
  "score": <integer 0-100, overall ATS/quality score>,
  "matchCategory": "<one of: 'Excellent Match', 'Strong Match', 'Competitive', 'Needs Work', 'Poor Match'>",
  "summary": "<1-2 sentence executive summary of this resume's ATS readiness and role fit>",
  "breakdown": [
    {
      "title": "<short section name, e.g. 'File Architecture & Formatting'>",
      "status": "success" | "warning" | "critical",
      "description": "<one sentence describing what this section evaluates>",
      "items": [
        { "type": "success" | "warning" | "critical", "text": "<specific, concrete observation about THIS resume's actual content>" }
      ]
    }
  ],
  "skillsMatrix": [
    { "name": "<specific skill/tool/keyword relevant to ${role || "the resume's field"}>", "found": <true if it appears in the resume text, false if it's a notable gap>, "category": "<short category label>" }
  ]
}

Rules:
- Base every observation strictly on the actual resume text above — never invent companies, numbers, or skills that aren't there.
- Include 2 to 4 "breakdown" sections (e.g. formatting/parseability, impact & metrics, keyword alignment, structure/sections present).
- Each section should have 2 to 4 "items".
- "skillsMatrix" should have 6 to 10 relevant entries: a mix of skills actually found in the resume (found: true) and important skills for ${role || "this type of role"} that are missing (found: false).
- Be specific — reference real details from the resume text (quote a weak bullet, name a missing standard section like "Education" if it's absent, etc.).
`;

    const raw = await callGemini(prompt);
    const parsed = safeParseJSON(raw);

    return NextResponse.json({
      score: Number.isFinite(parsed.score) ? Math.max(0, Math.min(100, Math.round(parsed.score))) : 50,
      matchCategory: parsed.matchCategory || "Competitive",
      summary: parsed.summary || "",
      metadata: {
        words: wordCount,
        readingTime,
        fileType: "PDF Document",
        scannability,
      },
      breakdown: Array.isArray(parsed.breakdown) ? parsed.breakdown : [],
      skillsMatrix: Array.isArray(parsed.skillsMatrix) ? parsed.skillsMatrix : [],
    });
  } catch (err) {
    console.error("check-ats route error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong analyzing this resume." }, { status: 500 });
  }
}