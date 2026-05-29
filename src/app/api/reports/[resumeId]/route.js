import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await connectDB();

    const { resumeId } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const report = await Report.findOne({ resumeId });

    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Report not found",
        },
        { status: 404 }
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
      { status: 500 }
    );
  }
}