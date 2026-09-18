import { NextResponse } from "next/server";

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
        temperature: 0.6,
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Gemini request failed (${response.status}): ${errText.slice(0, 200)}`);
  }

  const aiData = await response.json();
  const raw = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!raw) {
    throw new Error("Gemini returned an empty response.");
  }

  return raw;
}

function safeParseJSON(raw) {
  // Strip accidental markdown code fences, just in case.
  const cleaned = raw.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  return JSON.parse(cleaned);
}

async function generateQuestions(role) {
  const prompt = `
You are an expert interviewer hiring for the role "${role}".

Generate exactly 8 interview questions tailored specifically to this role.

Rules:
- Questions MUST be specific to the role "${role}" (its core skills, tools, and typical responsibilities).
- Include a mix of technical/domain knowledge, behavioral, and situational/problem-solving questions.
- Start with easier, warm-up questions and gradually increase difficulty.
- Do not repeat or rephrase the same question twice.
- Return ONLY a JSON array of exactly 8 strings, nothing else.

Example shape:
["Question 1", "Question 2", "Question 3"]
`;

  const raw = await callGemini(prompt);
  const parsed = safeParseJSON(raw);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Model did not return a valid question list.");
  }

  return parsed;
}

async function evaluateAnswer({ role, question, answer }) {
  const trimmedAnswer = (answer || "").trim();

  const prompt = `
You are a senior, fair but rigorous technical interviewer conducting a mock interview for the role "${role}".

Interview question asked:
"""${question}"""

Candidate's answer:
"""${trimmedAnswer || "(no answer provided)"}"""

Carefully evaluate the candidate's answer for accuracy, relevance, and completeness relative to what a strong candidate for "${role}" should say.

Respond with ONLY a raw JSON object (no markdown, no code fences, no commentary outside the JSON) in exactly this shape:
{
  "verdict": "correct" | "incomplete" | "wrong",
  "score": <integer from 0 to 100 rating answer quality>,
  "feedback": "<2-3 encouraging but honest sentences, under 60 words, explaining what was good and what was missing or incorrect>",
  "idealAnswer": "<a complete, well-structured, correct model answer to the question, under 130 words, so the candidate can compare and learn>"
}

Verdict rules:
- "correct": the answer is accurate, relevant, and reasonably complete.
- "incomplete": the answer is on the right track / partially correct but missing key points, depth, structure, or examples.
- "wrong": the answer is factually incorrect, irrelevant, or a non-answer (empty, "I don't know", gibberish, off-topic).

Always include a polished "idealAnswer", even when the verdict is "correct", so the candidate has something to benchmark against.
`;

  const raw = await callGemini(prompt);
  const parsed = safeParseJSON(raw);

  const verdict = ["correct", "incomplete", "wrong"].includes(parsed.verdict)
    ? parsed.verdict
    : "incomplete";

  return {
    verdict,
    score: Number.isFinite(parsed.score) ? Math.max(0, Math.min(100, Math.round(parsed.score))) : null,
    feedback: parsed.feedback || "",
    idealAnswer: parsed.idealAnswer || "",
  };
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      action,
      role = "Professional",
      questions = [],
      index = 0,
      answer = "",
    } = body;

    // --- Start a fresh interview session: generate the question bank ---
    if (action === "start") {
      if (!role || !role.trim()) {
        return NextResponse.json({ error: "Please enter a role to start the interview." }, { status: 400 });
      }

      const generatedQuestions = await generateQuestions(role.trim());

      return NextResponse.json({
        questions: generatedQuestions,
        index: 0,
        question: generatedQuestions[0],
        total: generatedQuestions.length,
      });
    }

    // --- Evaluate the candidate's answer to the current question ---
    if (action === "evaluate") {
      if (!Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json({ error: "Missing question set for this session." }, { status: 400 });
      }

      const currentQuestion = questions[index];
      if (currentQuestion === undefined) {
        return NextResponse.json({ error: "Invalid question index." }, { status: 400 });
      }

      const evaluation = await evaluateAnswer({ role, question: currentQuestion, answer });

      const nextIndex = index + 1;
      const completed = nextIndex >= questions.length;

      return NextResponse.json({
        ...evaluation,
        index,
        nextIndex,
        nextQuestion: completed ? null : questions[nextIndex],
        total: questions.length,
        completed,
      });
    }

    return NextResponse.json({ error: "Unknown or missing 'action'. Use 'start' or 'evaluate'." }, { status: 400 });
  } catch (error) {
    console.error("mock-interview route error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong." }, { status: 500 });
  }
}
