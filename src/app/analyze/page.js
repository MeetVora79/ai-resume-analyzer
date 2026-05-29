"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";

export default function AnalyzePage() {
  const inputRef = useRef(null);
  const router = useRouter();
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload, isUploading } = useUploadThing("resumeUploader", {
    onUploadBegin: () => {
      setUploadError("");
      setUploadedFile(null);
      setUploadProgress(0);
    },

    onUploadProgress: (progress) => {
      setUploadProgress(progress);
    },

    onClientUploadComplete: (res) => {
      const file = res?.[0];

      if (!file) {
        setUploadError("Upload completed but file data missing.");
        return;
      }

      const fileData = {
        name: file.name,
        url: file.ufsUrl || file.url || file.appUrl,
        key: file.key,
        size: file.size,
      };

      setUploadedFile(fileData);
      setUploadProgress(100);
    },

    onUploadError: (error) => {
      setUploadError(error.message || "Upload failed. Please try again.");
      setUploadProgress(0);
      setUploadedFile(null);
    },
  });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);
    setUploadError("");
    setUploadedFile(null);
    setUploadProgress(0);

    if (file.type !== "application/pdf") {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setUploadError("File size must be less than 4MB.");
      return;
    }

    await startUpload([file]);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!targetRole.trim()) {
      alert("Please enter target role");
      return;
    }

    if (isUploading) {
      alert("Please wait, resume is still uploading.");
      return;
    }

    if (!uploadedFile) {
      alert(
        "Please select your resume PDF first. It will upload automatically.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetRole,
          jobDescription,
          fileName: uploadedFile.name,
          fileUrl: uploadedFile.url,
          fileKey: uploadedFile.key,
          fileSize: uploadedFile.size,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save resume");
      }

      router.push(`/report/${data.data._id}`);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[80vh] bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              AI Resume Analyzer
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Upload your resume for AI analysis
            </h1>

            <p className="mt-3 text-muted-foreground">
              Select your target role and upload your resume PDF. Upload will
              start automatically.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resume Details</CardTitle>
              <CardDescription>
                Upload only PDF resume files. Maximum size allowed is 4MB.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Job Role</Label>
                  <Input
                    id="targetRole"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Example: React.js Developer, MERN Stack Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobDescription">
                    Job Description<span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here to get resume vs job match analysis..."
                    className="min-h-36 resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional, but recommended. If added, AI will compare your
                    resume directly with this job description.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Resume PDF</Label>

                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={() => {
                      if (!isUploading) inputRef.current?.click();
                    }}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-primary/30 bg-background p-8 text-center transition hover:bg-muted/50"
                  >
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      {isUploading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                      ) : uploadedFile ? (
                        <CheckCircle2 className="h-7 w-7 text-green-600" />
                      ) : (
                        <Upload className="h-7 w-7 text-primary" />
                      )}
                    </div>

                    <p className="text-base font-semibold">
                      {uploadedFile
                        ? "Resume uploaded successfully"
                        : isUploading
                          ? `Uploading resume... ${uploadProgress}%`
                          : selectedFile
                            ? selectedFile.name
                            : "Click to select resume PDF"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {uploadedFile
                        ? uploadedFile.name
                        : isUploading
                          ? "Please wait while your resume is uploading"
                          : "PDF only • Max 4MB • Upload starts automatically"}
                    </p>

                    {isUploading && (
                      <div className="mx-auto mt-5 max-w-sm">
                        <Progress value={uploadProgress} />
                      </div>
                    )}

                    <Button
                      type="button"
                      className="mt-5"
                      disabled={isUploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        inputRef.current?.click();
                      }}
                    >
                      {uploadedFile
                        ? "Replace PDF"
                        : selectedFile
                          ? "Choose Another PDF"
                          : "Choose PDF"}
                    </Button>
                  </div>

                  {uploadError && (
                    <div className="rounded-xl border bg-red-50 p-4 text-sm text-red-700">
                      <div className="flex items-center gap-2 font-medium">
                        <XCircle className="h-4 w-4" />
                        Upload failed
                      </div>
                      <p className="mt-1">{uploadError}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border bg-muted/40 p-4">
                  <div className="flex gap-3">
                    <FileText className="mt-1 h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-medium">What you will get</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ATS score, strengths, weaknesses, missing skills,
                        recommended keywords, and improvement suggestions.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full hover:cursor-pointer"
                  disabled={isSubmitting || isUploading || !uploadedFile}
                >
                  {isSubmitting
                    ? "Saving Resume..."
                    : isUploading
                      ? "Uploading Resume..."
                      : "Analyze Resume"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </section>
  );
}
