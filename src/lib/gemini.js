import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

function cleanJsonResponse(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function analyzeResumeWithGemini({ pdfBuffer, targetRole }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

  const prompt = `
You are a senior technical recruiter and ATS resume expert.

Analyze the attached resume PDF for this target role: ${targetRole}

Return ONLY valid JSON. No markdown. No extra explanation.

JSON structure:
{
  "atsScore": number between 0 and 100,
  "summary": "short summary",
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "missingSkills": ["skill 1", "skill 2"],
  "recommendedKeywords": ["keyword 1", "keyword 2"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "projectSuggestions": ["project idea 1", "project idea 2"],
  "formattingIssues": ["issue 1", "issue 2"]
}

Rules:
- Be practical and honest.
- Focus on ATS, job-role match, technical skills, projects, keywords, and clarity.
- Keep each array item short and clear.
- Give at least 4 suggestions.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Pdf,
            },
          },
        ],
      },
    ],
  });

  const text = response.text;
  const cleaned = cleanJsonResponse(text);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini raw response:", text);
    throw new Error("Gemini returned invalid JSON");
  }
}