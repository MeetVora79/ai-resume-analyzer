import { auth } from "@clerk/nextjs/server";
import Resume from "@/models/Resume";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { resumeId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 },
      );
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      userId,
    });

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 },
      );
    }

    const report = await Report.findOne({ resumeId });

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Report not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Get report error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching report",
      },
      { status: 500 },
    );
  }
}
