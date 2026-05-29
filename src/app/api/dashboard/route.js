import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import Report from "@/models/Report";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const resumes = await Resume.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const resumeIds = resumes.map((resume) => resume._id);

    const reports = await Report.find({
      resumeId: { $in: resumeIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalAnalyses = resumes.length;
    const completedReports = reports.length;

    const totalScore = reports.reduce((sum, report) => {
      return sum + report.atsScore;
    }, 0);

    const averageScore =
      completedReports > 0 ? Math.round(totalScore / completedReports) : 0;

    const bestScore =
      completedReports > 0
        ? Math.max(...reports.map((report) => report.atsScore))
        : 0;

    const reportsMap = new Map();

    reports.forEach((report) => {
      reportsMap.set(report.resumeId.toString(), report);
    });

    const recentAnalyses = resumes.map((resume) => {
      const report = reportsMap.get(resume._id.toString());

      return {
        _id: resume._id.toString(),
        fileName: resume.fileName,
        targetRole: resume.targetRole,
        status: resume.status,
        createdAt: resume.createdAt,
        atsScore: report?.atsScore || null,
        reportId: report?._id?.toString() || null,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalAnalyses,
          completedReports,
          averageScore,
          bestScore,
        },
        recentAnalyses,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while fetching dashboard data",
      },
      { status: 500 }
    );
  }
}