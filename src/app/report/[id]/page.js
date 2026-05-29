import DownloadReportButton from "@/components/report/DownloadReportButton";
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
  Sparkles,
  TrendingUp,
  Trophy,
  AlertTriangle,
  Lightbulb,
  BadgeCheck,
  XCircle,
  ListChecks,
  Tags,
  WandSparkles,
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

function getScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Work";
  return "Poor";
}

function getScoreDescription(score) {
  if (score >= 85) {
    return "Your resume is strongly aligned with this role.";
  }

  if (score >= 70) {
    return "Your resume is good, but a few improvements can make it stronger.";
  }

  if (score >= 50) {
    return "Your resume has potential, but it needs important improvements.";
  }

  return "Your resume needs major improvements before applying.";
}

function getScoreBadgeVariant(score) {
  if (score >= 70) return "default";
  if (score >= 50) return "secondary";
  return "destructive";
}

function getJobMatchLabel(score) {
  if (score >= 85) return "Strong Match";
  if (score >= 70) return "Good Match";
  if (score >= 50) return "Partial Match";
  return "Weak Match";
}

function getJobMatchDescription(score) {
  if (score >= 85) {
    return "Your resume aligns strongly with this job description.";
  }

  if (score >= 70) {
    return "Your resume matches this job well, but some keywords can be improved.";
  }

  if (score >= 50) {
    return "Your resume partially matches this job description.";
  }

  return "Your resume needs significant changes to match this job description.";
}

function SectionList({
  title,
  description,
  items = [],
  type = "default",
  icon: Icon = ListChecks,
}) {
  if (!items || items.length === 0) return null;

  const colorClass =
    type === "good"
      ? "bg-green-500"
      : type === "bad"
        ? "bg-red-500"
        : type === "warning"
          ? "bg-yellow-500"
          : "bg-primary";

  return (
    <Card className="print-card">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex gap-3 rounded-lg border bg-muted/30 p-3 text-sm leading-6"
            >
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${colorClass}`}
              />
              <span className="min-w-0 break-words text-muted-foreground">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function KeywordBadges({ title, description, items = [], icon: Icon = Tags }) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-5 w-5 text-primary" />
          </div>

          <div>
            <CardTitle className="text-md">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="p-3 text-sm">
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ReportPage({ params }) {
  const { id } = await params;

  const resume = await getResume(id);
  const report = await getReport(id);

  return (
    <section className="print-area min-h-[80vh] bg-muted/40 py-10">
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

            <div className="flex gap-3 no-print">
              <DownloadReportButton />

              <Button variant="outline" asChild>
                <Link href="/analyze">Analyze Another Resume</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:sticky lg:top-24 lg:col-span-1 lg:self-start">
              {report && (
                <Card className="print-card overflow-hidden p-0">
                  <CardHeader className="rounded-t-xl bg-muted/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle>ATS Score</CardTitle>
                        <CardDescription className="mt-1">
                          Resume match score for your target role
                        </CardDescription>
                      </div>

                      <Badge variant={getScoreBadgeVariant(report.atsScore)}>
                        {getScoreLabel(report.atsScore)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="mb-5 text-center">
                      <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-8 border-primary/20 bg-primary/10">
                        <div>
                          <p className="text-4xl font-bold">
                            {report.atsScore}
                          </p>
                          <p className="text-xs text-muted-foreground">/100</p>
                        </div>
                      </div>

                      <p className="font-medium">
                        {getScoreDescription(report.atsScore)}
                      </p>
                    </div>

                    <Progress value={report.atsScore} />

                    <div className="mt-5 grid grid-cols-2 gap-3 text-center text-sm">
                      <div className="rounded-xl border bg-muted/40 p-3">
                        <p className="text-muted-foreground">Target Role</p>
                        <p className="mt-1 font-medium">{resume.targetRole}</p>
                      </div>

                      <div className="rounded-xl border bg-muted/40 p-3">
                        <p className="text-muted-foreground">Status</p>
                        <p className="mt-1 font-medium capitalize">
                          {resume.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {report?.jobMatchScore && resume.jobDescription && (
                <Card className="print-card overflow-hidden p-0">
                  <CardHeader className="rounded-t-xl bg-muted/60 p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle>Job Match Score</CardTitle>
                        <CardDescription className="mt-1">
                          Resume match against pasted job description
                        </CardDescription>
                      </div>

                      <Badge
                        variant={getScoreBadgeVariant(report.jobMatchScore)}
                      >
                        {getJobMatchLabel(report.jobMatchScore)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="mb-5 text-center">
                      <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-8 border-primary/20 bg-primary/10">
                        <div>
                          <p className="text-4xl font-bold">
                            {report.jobMatchScore}
                          </p>
                          <p className="text-xs text-muted-foreground">/100</p>
                        </div>
                      </div>

                      <p className="font-medium">
                        {getJobMatchDescription(report.jobMatchScore)}
                      </p>
                    </div>

                    <Progress value={report.jobMatchScore} />
                  </CardContent>
                </Card>
              )}

              <Card className="print-card">
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

                  <Button
                    variant="outline"
                    asChild
                    className="w-full bg-black/20"
                  >
                    <Link href={resume.fileUrl} target="_blank">
                      View Uploaded Resume
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              {!report ? (
                <AutoGenerateReport resumeId={id} />
              ) : (
                <>
                  <Card className="print-card overflow-hidden p-0">
                    <CardHeader className="rounded-t-xl bg-muted/60 p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background">
                          <Sparkles className="h-6 w-6 text-primary" />
                        </div>

                        <div>
                          <CardTitle>AI Summary</CardTitle>
                          <CardDescription className="mt-1">
                            Recruiter-style overview of your resume
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-6 py-4">
                      <p className="leading-8 text-muted-foreground">
                        {report.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {resume.jobDescription && report.jobMatchScore && (
                    <Card className="print-card overflow-hidden p-0">
                      <CardHeader className="rounded-t-xl bg-muted/60 p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background">
                            <Target className="h-6 w-6 text-primary" />
                          </div>

                          <div>
                            <CardTitle>Job Description Match</CardTitle>
                            <CardDescription className="mt-1">
                              How well your resume matches the pasted job
                              description
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-6 p-8">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <p className="font-medium">Match Score</p>
                            <Badge
                              variant={getScoreBadgeVariant(
                                report.jobMatchScore,
                              )}
                            >
                              {report.jobMatchScore}/100
                            </Badge>
                          </div>

                          <Progress value={report.jobMatchScore} />

                          <p className="mt-3 text-sm text-muted-foreground">
                            {getJobMatchDescription(report.jobMatchScore)}
                          </p>
                        </div>

                        <div className="rounded-xl border bg-muted/30 p-4">
                          <p className="mb-3 font-medium">Matching Skills</p>

                          {report.matchingSkills?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {report.matchingSkills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="p-3"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No matching skills detected.
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border bg-muted/30 p-4">
                          <p className="mb-3 font-medium">
                            Missing JD Keywords
                          </p>

                          {report.missingKeywordsFromJD?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {report.missingKeywordsFromJD.map(
                                (keyword, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="max-w-full whitespace-normal p-3"
                                  >
                                    {keyword}
                                  </Badge>
                                ),
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No major missing job keywords detected.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <KeywordBadges
                    title="Missing Skills"
                    description="Technical skills or tools missing from your resume"
                    items={report.missingSkills}
                    icon={AlertTriangle}
                  />

                  <KeywordBadges
                    title="Recommended Keywords"
                    description="Keywords to improve ATS visibility"
                    items={report.recommendedKeywords}
                    icon={Tags}
                  />

                  <SectionList
                    title="Priority Improvements"
                    description="Apply these changes first to improve your score"
                    items={report.suggestions}
                    icon={Lightbulb}
                  />

                  {resume.jobDescription && (
                    <SectionList
                      title="Job-specific Suggestions"
                      description="Suggestions based on the pasted job description"
                      items={report.jobSpecificSuggestions}
                      icon={Target}
                    />
                  )}

                  <SectionList
                    title="Project Suggestions"
                    description="Projects that can strengthen your profile"
                    items={report.projectSuggestions}
                    icon={WandSparkles}
                  />

                  <SectionList
                    title="Formatting Issues"
                    description="Issues that may hurt ATS parsing or recruiter readability"
                    items={report.formattingIssues}
                    type="bad"
                    icon={AlertTriangle}
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
