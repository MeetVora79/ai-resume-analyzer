import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { NextResponse } from "next/server";
import { z } from "zod";

const createResumeSchema = z.object({
  targetRole: z.string().min(2, "Target role is required"),

  fileName: z.string().min(1, "File name is required"),

  fileUrl: z.string().url("Valid file URL is required"),

  fileKey: z.string().optional(),

  fileSize: z.number().optional(),
});

export async function POST(req) {
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

    const body = await req.json();

    const validatedData = createResumeSchema.parse(body);

    const resume = await Resume.create({
      userId,
      targetRole: validatedData.targetRole,
      fileName: validatedData.fileName,
      fileUrl: validatedData.fileUrl,
      fileKey: validatedData.fileKey,
      fileSize: validatedData.fileSize,
      status: "uploaded",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Resume saved successfully",
        data: resume,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    console.error("Create resume error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while saving resume",
      },
      { status: 500 },
    );
  }
}
