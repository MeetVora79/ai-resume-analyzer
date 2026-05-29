import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Brain, FileText, LineChart, ShieldCheck, Upload } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and get a detailed AI-powered analysis.",
  },
  {
    icon: LineChart,
    title: "ATS Score",
    description: "Check how well your resume matches modern ATS systems.",
  },
  {
    icon: Brain,
    title: "AI Suggestions",
    description: "Get role-based improvement suggestions using Gemini AI.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Uploads",
    description: "Your resume is securely uploaded and stored.",
  },
];

const steps = [
  "Upload your resume PDF",
  "Choose your target job role",
  "AI analyzes your resume",
  "Get score, skills and suggestions",
];

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-b from-muted/60 to-background py-24">
        <Container className="text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border px-4 py-2 text-sm text-muted-foreground">
              <BadgeCheck className="mr-2 h-4 w-4 text-primary" />
              AI-powered resume improvement platform
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Improve your resume with{" "}
              <span className="text-primary">AI-powered ATS analysis</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground">
              Upload your resume, select a target role, and get a detailed report with ATS score,
              missing skills, strengths, weaknesses, and improvement suggestions.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/analyze">
                  <Upload className="mr-2 h-5 w-5" />
                  Analyze Resume
                </Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section id="features" className="py-20">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="mt-3 text-muted-foreground">
              Everything needed for a professional resume review experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="bg-muted/40 py-20">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">
              Simple workflow, professional result.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {steps.map((step, index) => (
              <Card key={step}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}