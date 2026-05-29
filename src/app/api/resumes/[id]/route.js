import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 }
      );
    }

    const resume = await Resume.findById(id);

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          message: "Resume not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error("Get resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching resume",
      },
      { status: 500 }
    );
  }
}