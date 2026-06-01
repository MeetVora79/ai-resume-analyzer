import Link from "next/link";
import Container from "./Container";
import SectionLink from "@/components/shared/SectionLink";
import { FileText, ShieldCheck, Upload, BarChart3 } from "lucide-react";

const productLinks = [
  {
    label: "Analyze Resume",
    href: "/analyze",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "Workflow",
    href: "/#how-it-works",
  },
];

const featureLinks = [
  {
    label: "ATS Score",
    href: "/#features",
  },
  {
    label: "JD Match",
    href: "/#job-match",
  },
  {
    label: "AI Suggestions",
    href: "/#features",
  },
  {
    label: "Resume Reports",
    href: "/dashboard",
  },
];

function FooterLink({ href, children }) {
  const className =
    "text-sm text-muted-foreground transition hover:text-foreground";

  if (href.includes("#")) {
    return (
      <SectionLink href={href} className={className}>
        {children}
      </SectionLink>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <Container className="py-12 sm:pt-16 sm:pb-12">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <FileText className="h-5 w-5" />
              </div>

              <span className="text-2xl font-bold tracking-tight">
                Resume<span className="text-primary">AI</span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">
              ResumeAI helps job seekers improve their resumes using AI-powered
              ATS scoring, job description matching, keyword analysis, and
              practical improvement suggestions.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Secure Upload</p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">ATS Insights</p>
              </div>

              <div className="rounded-2xl border bg-background p-4">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-medium">Private Reports</p>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">Product</h3>

            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold">Features</h3>

            <ul className="mt-4 space-y-3">
              {featureLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 ResumeAI. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
