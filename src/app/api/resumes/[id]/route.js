import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
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

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid resume ID",
        },
        { status: 400 },
      );
    }

    const resume = await Resume.findOne({
      _id: id,
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
      { status: 500 },
    );
  }
}
