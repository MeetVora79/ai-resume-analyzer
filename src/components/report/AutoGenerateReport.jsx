"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";


export default function AutoGenerateReport({ resumeId }) {
  const router = useRouter();

  const [status, setStatus] = useState("generating");
  const [message, setMessage] = useState("Preparing your resume analysis...");
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let progressTimer;

    async function generateReport() {
      try {
        setStatus("generating");
        setMessage("AI is analyzing your resume...");
        setProgress(25);

        progressTimer = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 90) return prev;
            return prev + 5;
          });
        }, 800);

        const res = await fetch("/api/reports/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to generate report");
        }

        setProgress(100);
        setMessage("Report generated successfully!");
        toast.success("AI report generated successfully");

        setTimeout(() => {
          router.refresh();
        }, 700);
      } catch (error) {
        setStatus("failed");
        setMessage(error.message || "Something went wrong");
        toast.error(error.message || "Report generation failed");
      } finally {
        if (progressTimer) clearInterval(progressTimer);
      }
    }

    generateReport();

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [resumeId, router]);

  if (status === "failed") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Analysis Failed
          </CardTitle>
          <CardDescription>
            We could not generate your resume analysis.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>

          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Generating AI Analysis
        </CardTitle>
        <CardDescription>
          Please wait while AI reviews your resume.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <p className="text-xs text-muted-foreground">
          This may take a few seconds because the PDF is being reviewed by AI.
        </p>
      </CardContent>
    </Card>
  );
}