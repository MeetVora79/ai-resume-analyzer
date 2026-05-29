import AutoGenerateReport from "@/components/report/AutoGenerateReport";
import Container from "@/components/shared/Container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Target,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import Report from "@/models/Report";

async function getResume(id) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  await connectDB();

  const resume = await Resume.findOne({
    _id: id,
    userId,
  }).lean();

  if (!resume) {
    notFound();
  }

  return JSON.parse(JSON.stringify(resume));
}

async function getReport(resumeId) {
  const report = await Report.findOne({
    resumeId,
  }).lean();

  if (!report) {
    return null;
  }

  return JSON.parse(JSON.stringify(report));
}

function SectionList({ title, items = [], type = "default" }) {
  if (!items || items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  type === "good"
                    ? "bg-green-500"
                    : type === "bad"
                      ? "bg-red-500"
                      : "bg-primary"
                }`}
              />
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default async function ReportPage({ params }) {
  const { id } = await params;

  const resume = await getResume(id);
  const report = await getReport(id);

  return (
    <section className="min-h-[80vh] bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge className="mb-4" variant="secondary">
                Resume Report
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Resume Analysis Report
              </h1>

              <p className="mt-3 text-muted-foreground">
                Review your uploaded resume and AI-powered ATS analysis.
              </p>
            </div>

            <Button variant="outline" asChild>
              <Link href="/analyze">Analyze Another Resume</Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Details</CardTitle>
                  <CardDescription>Uploaded resume information</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="flex gap-3">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">File Name</p>
                      <p className="font-medium">{resume.fileName}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Target className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Target Role
                      </p>
                      <p className="font-medium">{resume.targetRole}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium capitalize">{resume.status}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Uploaded At
                      </p>
                      <p className="font-medium">
                        {new Date(resume.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" asChild className="w-full">
                    <Link href={resume.fileUrl} target="_blank">
                      View Uploaded Resume
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {report && (
                <Card>
                  <CardHeader>
                    <CardTitle>ATS Score</CardTitle>
                    <CardDescription>
                      Resume match score for your target role
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="mb-4 flex items-end gap-2">
                      <span className="text-5xl font-bold">
                        {report.atsScore}
                      </span>
                      <span className="mb-1 text-muted-foreground">/100</span>
                    </div>

                    <Progress value={report.atsScore} />

                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      {report.atsScore >= 80
                        ? "Strong resume for this role"
                        : report.atsScore >= 60
                          ? "Good but needs improvements"
                          : "Needs major improvements"}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6 lg:col-span-2">
              {!report ? (
                <AutoGenerateReport resumeId={id} />
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                      <CardDescription>AI-generated overview</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <p className="text-muted-foreground">{report.summary}</p>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <SectionList
                      title="Strengths"
                      items={report.strengths}
                      type="good"
                    />
                    <SectionList
                      title="Weaknesses"
                      items={report.weaknesses}
                      type="bad"
                    />
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <SectionList
                      title="Missing Skills"
                      items={report.missingSkills}
                    />
                    <SectionList
                      title="Recommended Keywords"
                      items={report.recommendedKeywords}
                    />
                  </div>

                  <SectionList
                    title="Improvement Suggestions"
                    items={report.suggestions}
                  />

                  <SectionList
                    title="Project Suggestions"
                    items={report.projectSuggestions}
                  />

                  <SectionList
                    title="Formatting Issues"
                    items={report.formattingIssues}
                    type="bad"
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
