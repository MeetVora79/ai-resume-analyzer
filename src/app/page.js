import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  CheckCircle2,
  FileText,
  LineChart,
  Lock,
  Sparkles,
  Target,
  Upload,
  WandSparkles,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "AI Resume Analysis",
    description:
      "Upload your resume and get a recruiter-style review with practical improvement suggestions.",
  },
  {
    icon: BarChart3,
    title: "ATS Score",
    description:
      "Understand how well your resume matches ATS systems and modern hiring filters.",
  },
  {
    icon: Target,
    title: "Job Description Match",
    description:
      "Paste a job description and compare your resume against real role requirements.",
  },
  {
    icon: WandSparkles,
    title: "Smart Suggestions",
    description:
      "Get missing skills, recommended keywords, project ideas, and formatting improvements.",
  },
];

const steps = [
  {
    title: "Upload Resume",
    description: "Upload your PDF resume securely.",
    icon: Upload,
  },
  {
    title: "Add Target Role",
    description: "Enter role and optional job description.",
    icon: Target,
  },
  {
    title: "AI Reviews",
    description: "Gemini AI analyzes your resume and role match.",
    icon: Brain,
  },
  {
    title: "Improve Resume",
    description: "Get scores, keywords, and actionable suggestions.",
    icon: CheckCircle2,
  },
];

const benefits = [
  "ATS score with role-based analysis",
  "Resume vs job description match",
  "Missing skills and keyword suggestions",
  "Dashboard with previous reports",
  "Secure login and private reports",
];

export default function HomePage() {
  return (
    <div className="overflow-hidden bg-background">
      {/* Hero Section */}
      <section className="relative border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.10),transparent_28%)]" />

        <Container className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-16 lg:py-20">
          <div className="mx-auto max-w-5xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              AI-powered resume improvement platform
            </div>

            <h1 className="mx-auto max-w-5xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build a resume that gets{" "}
              <span className="bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                noticed by recruiters
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              ResumeAI analyzes your resume, calculates ATS score, compares it
              with job descriptions, and gives practical suggestions to improve
              your chances of getting shortlisted.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/analyze">
                  Analyze Resume
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">Explore Features</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                No manual review needed
              </div>

              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                Secure uploads
              </div>

              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-600" />
                Fast AI analysis
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-muted/30 py-10">
        <Container>
          <div className="grid gap-6 text-center sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold">ATS</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Role-based resume scoring
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold">JD Match</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Resume vs job description comparison
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold">AI Tips</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Practical suggestions to improve resume
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 inline-flex rounded-full border px-4 py-2 text-sm text-muted-foreground">
              <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
              Features
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to improve your resume
            </h2>

            <p className="mt-4 text-muted-foreground">
              ResumeAI combines AI analysis, ATS scoring, job matching, and
              dashboard analytics into one polished workflow.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card
                  key={feature.title}
                  className="group rounded-2xl transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-semibold">{feature.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-20 sm:py-24">
        <Container>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-4 inline-flex rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
              <LineChart className="mr-2 h-4 w-4 text-primary" />
              Workflow
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Analyze your resume in four simple steps
            </h2>

            <p className="mt-4 text-muted-foreground">
              A simple but powerful process designed for job seekers and
              developers preparing for interviews.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card key={step.title} className="relative rounded-2xl">
                  <CardContent className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>

                      <span className="text-4xl font-bold text-muted-foreground/20">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold">{step.title}</h3>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Highlight Section */}
      <section id="job-match" className="py-20 sm:py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border px-4 py-2 text-sm text-muted-foreground">
                <Target className="mr-2 h-4 w-4 text-primary" />
                Job-targeted analysis
              </div>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Compare your resume directly with a job description
              </h2>

              <p className="mt-5 leading-8 text-muted-foreground">
                Instead of generic feedback, ResumeAI can compare your resume
                against a real job description and tell you exactly what skills,
                keywords, and improvements are needed for that role.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-4 w-4 text-green-700" />
                    </div>
                    <p className="text-sm text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            <Card className="rounded-3xl shadow-xl">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Job Match Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Resume compared with job description
                    </p>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    84/100
                  </span>
                </div>

                <div className="mb-6 h-3 rounded-full bg-muted">
                  <div className="h-3 w-[84%] rounded-full bg-primary" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border p-4">
                    <p className="mb-3 font-medium">Matching Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {["React", "Node.js", "MongoDB", "REST API"].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full bg-muted px-3 py-1 text-sm"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border p-4">
                    <p className="mb-3 font-medium">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {["TypeScript", "Testing", "Docker"].map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-muted px-3 py-1 text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="px-4 pb-20 sm:pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl sm:px-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_30%)]" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to improve your resume?
              </h2>

              <p className="mt-4 text-primary-foreground/80">
                Upload your resume, add your target role, and get a complete AI
                analysis within seconds.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/analyze">
                    Start Analysis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  asChild
                >
                  <Link href="/dashboard">Open Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
