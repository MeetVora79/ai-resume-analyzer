"use client";

import Link from "next/link";
import Container from "./Container";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLinkClass = (href) =>
    `text-sm transition ${
      isActive(href)
        ? "font-semibold text-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Resume<span className="text-primary">AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Show when="signed-in">
            <Link href="/dashboard" className={navLinkClass("/dashboard")}>
              Dashboard
            </Link>
          </Show>

          <Link
            href="/#features"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Features
          </Link>

          <Link
            href="/#how-it-works"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <Button variant="ghost">Login</Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button>Get Started</Button>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <Button
              asChild
              variant={isActive("/analyze") ? "default" : "outline"}
            >
              <Link href="/analyze">Analyze Resume</Link>
            </Button>

            <UserButton />
          </Show>
        </div>
      </Container>
    </header>
  );
}
