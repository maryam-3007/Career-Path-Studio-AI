import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "Missing file blueprint input" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const parsedText = pdfData.text.toLowerCase();

    // Custom structural validation logic matching your interests
    const trackingKeywords = ["react", "next.js", "tailwind", "css", "javascript"];
    let matchedKeywords = [];
    
    trackingKeywords.forEach(kw => {
      if (parsedText.includes(kw)) matchedKeywords.push(kw);
    });

    // Compute an accurate baseline score
    const totalScore = Math.min(40 + (matchedKeywords.length * 12), 100);

    return NextResponse.json({
      score: totalScore,
      textLength: parsedText.length,
      matches: matchedKeywords
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Parsing Exception Triggered" }, { status: 500 });
  }
}