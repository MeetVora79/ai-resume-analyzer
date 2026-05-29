import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import Report from "@/models/Report";
import { analyzeResumeWithGemini } from "@/lib/gemini";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDB();

    const { resumeId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 },
      );
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 },
      );
    }

    const existingReport = await Report.findOne({ resumeId });

    if (existingReport) {
      return NextResponse.json({
        success: true,
        message: "Report already exists",
        data: existingReport,
      });
    }

    resume.status = "analyzing";
    await resume.save();

    const fileResponse = await fetch(resume.fileUrl);

    if (!fileResponse.ok) {
      resume.status = "failed";
      await resume.save();

      return NextResponse.json(
        {
          success: false,
          message: "Failed to download uploaded resume",
        },
        { status: 400 },
      );
    }

    const arrayBuffer = await fileResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer || buffer.length < 1000) {
      resume.status = "failed";
      await resume.save();

      return NextResponse.json(
        {
          success: false,
          message: "Could not read uploaded PDF file",
        },
        { status: 400 },
      );
    }

    const aiResult = await analyzeResumeWithGemini({
      pdfBuffer: buffer,
      targetRole: resume.targetRole,
    });

    const report = await Report.create({
      resumeId: resume._id,
      atsScore: aiResult.atsScore,
      summary: aiResult.summary,
      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      missingSkills: aiResult.missingSkills || [],
      recommendedKeywords: aiResult.recommendedKeywords || [],
      suggestions: aiResult.suggestions || [],
      projectSuggestions: aiResult.projectSuggestions || [],
      formattingIssues: aiResult.formattingIssues || [],
      rawText: "",
    });

    resume.status = "completed";
    await resume.save();

    return NextResponse.json({
      success: true,
      message: "Report generated successfully",
      data: report,
    });
  } catch (error) {
    console.error("Generate report error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "Something went wrong while generating report",
      },
      { status: 500 },
    );
  }
}
