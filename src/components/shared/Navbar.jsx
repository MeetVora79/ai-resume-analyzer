"use client";

import Link from "next/link";
import Container from "./Container";
import { Button } from "@/components/ui/button";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Resume<span className="text-primary">AI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
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

          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
          </Show>
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
            <Button asChild>
              <Link href="/analyze">Analyze Resume</Link>
            </Button>

            <UserButton />
          </Show>
        </div>
      </Container>
    </header>
  );
}