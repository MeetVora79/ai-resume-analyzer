import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import Report from "@/models/Report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trophy, BarChart3, CheckCircle2, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import DeleteResumeButton from "@/components/dashboard/DeleteResumeButton";

async function getDashboardData() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  await connectDB();

  const resumes = await Resume.find({ userId }).sort({ createdAt: -1 }).lean();

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
      createdAt: resume.createdAt.toISOString(),
      atsScore: report?.atsScore || null,
    };
  });

  const chartData = reports
    .map((report) => {
      const resume = resumes.find(
        (resume) => resume._id.toString() === report.resumeId.toString(),
      );

      return {
        date: new Date(report.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        atsScore: report.atsScore,
        targetRole: resume?.targetRole || "Unknown",
      };
    })
    .reverse();

  return {
    stats: {
      totalAnalyses,
      completedReports,
      averageScore,
      bestScore,
    },
    recentAnalyses,
    chartData,
  };
}

function getScoreBadgeVariant(score) {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
}

function getStatusVariant(status) {
  if (status === "completed") return "default";
  if (status === "failed") return "destructive";
  return "secondary";
}

function StatsCard({ title, value, icon: Icon, description }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className="mt-2 text-3xl font-bold">{value}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const { stats, recentAnalyses, chartData } = await getDashboardData();

  return (
    <section className="min-h-[80vh] bg-muted/40 py-10">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Badge variant="secondary" className="mb-3">
              Dashboard
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Resume Analytics
            </h1>

            <p className="mt-2 text-muted-foreground">
              Track your resume analyses, ATS scores, and improvement progress.
            </p>
          </div>

          <Button asChild>
            <Link href="/analyze">
              <Plus className="mr-2 h-4 w-4" />
              Analyze New Resume
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Total Analyses"
            value={stats.totalAnalyses}
            icon={FileText}
            description="Total resumes uploaded"
          />

          <StatsCard
            title="Completed Reports"
            value={stats.completedReports}
            icon={CheckCircle2}
            description="AI reports generated"
          />

          <StatsCard
            title="Average ATS Score"
            value={`${stats.averageScore}/100`}
            icon={BarChart3}
            description="Average score across reports"
          />

          <StatsCard
            title="Best Score"
            value={`${stats.bestScore}/100`}
            icon={Trophy}
            description="Highest ATS score achieved"
          />
        </div>

        <DashboardCharts chartData={chartData} />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>

          <CardContent>
            {recentAnalyses.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-background p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-7 w-7 text-primary" />
                </div>

                <h3 className="font-semibold">No resumes analyzed yet</h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Upload your first resume and get an AI-powered ATS analysis
                  report.
                </p>

                <Button asChild className="mt-6">
                  <Link href="/analyze">Analyze Resume</Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resume</TableHead>
                      <TableHead>Target Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>ATS Score</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {recentAnalyses.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="max-w-[220px] truncate font-medium">
                          {item.fileName}
                        </TableCell>

                        <TableCell>{item.targetRole}</TableCell>

                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {item.atsScore ? (
                            <Badge
                              variant={getScoreBadgeVariant(item.atsScore)}
                            >
                              {item.atsScore}/100
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Pending
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/report/${item._id}`}>View</Link>
                            </Button>

                            <DeleteResumeButton
                              resumeId={item._id}
                              fileName={item.fileName}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}
