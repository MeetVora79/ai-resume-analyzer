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

export async function analyzeResumeWithGemini({
  pdfBuffer,
  targetRole,
  jobDescription = "",
}) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const base64Pdf = Buffer.from(pdfBuffer).toString("base64");

  const hasJobDescription = jobDescription && jobDescription.trim().length > 30;

  const prompt = `
You are a senior technical recruiter and ATS resume expert.

Analyze the attached resume PDF for this target role: ${targetRole}

${
  hasJobDescription
    ? `Also compare the resume with this job description:

"""
${jobDescription}
"""`
    : "No job description was provided. Analyze based on the target role only."
}

Return ONLY valid JSON. No markdown. No extra explanation.

JSON structure:
{
  "atsScore": number between 0 and 100,
  "jobMatchScore": number between 0 and 100,
  "summary": "short summary",
  "strengths": ["point 1", "point 2"],
  "weaknesses": ["point 1", "point 2"],
  "missingSkills": ["short technical skill/tool only, example: Redux, TypeScript, Docker"],
  "recommendedKeywords": ["short ATS keyword, max 3 words"],
  "matchingSkills": ["short skill already present in resume and relevant to JD"],
  "missingKeywordsFromJD": ["short JD keyword/phrase missing from resume, max 4 words"],
  "suggestions": ["suggestion 1", "suggestion 2"],
  "jobSpecificSuggestions": ["JD-specific suggestion 1", "JD-specific suggestion 2"],
  "projectSuggestions": ["project idea 1", "project idea 2"],
  "formattingIssues": ["issue 1", "issue 2"]
}

Rules:
- Be practical and honest.
- If job description is provided, calculate jobMatchScore based on resume-to-JD match.
- If no job description is provided, make jobMatchScore same as atsScore.
- Focus on ATS, job-role match, technical skills, projects, keywords, and clarity.
- Keep each array item short and clear.
- Give at least 4 suggestions.
- Give at least 3 recommendedKeywords.
- missingSkills must contain only technical skills, tools, frameworks, libraries, or platforms.
- missingKeywordsFromJD must contain short job-description keywords or phrases, not full sentences.
- Do not put long responsibilities in missingKeywordsFromJD.
- Keep missingKeywordsFromJD items under 4 words.
- Avoid duplicates between missingSkills and missingKeywordsFromJD.
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
