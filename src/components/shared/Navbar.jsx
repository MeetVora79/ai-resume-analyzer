"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "./Container";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { FileText } from "lucide-react";
import SectionLink from "@/components/shared/SectionLink";

const publicLinks = [
  {
    label: "Features",
    href: "/#features",
    hash: "#features",
  },
  {
    label: "Workflow",
    href: "/#how-it-works",
    hash: "#how-it-works",
  },
  {
    label: "JD Match",
    href: "/#job-match",
    hash: "#job-match",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useUser();
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    if (pathname !== "/") {
      setActiveHash("");
      return;
    }

    const sections = publicLinks
      .map((link) => document.querySelector(link.hash))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries.find((entry) => entry.isIntersecting);

        if (visibleSection) {
          const hash = `#${visibleSection.target.id}`;
          setActiveHash(hash);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      },
    );

    sections.forEach((section) => observer.observe(section));

    const handleScrollTop = () => {
      if (window.scrollY < 250) {
        setActiveHash("");
      }
    };

    window.addEventListener("scroll", handleScrollTop, { passive: true });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      window.removeEventListener("scroll", handleScrollTop);
    };
  }, [pathname]);

  const isActivePath = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const linkClass = (active) =>
    `relative text-sm font-medium transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all ${
      active
        ? "text-foreground after:w-full"
        : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
    }`;

  const isSectionActive = (hash) => pathname === "/" && activeHash === hash;

  const handleSectionClick = (e, hash) => {
    e.preventDefault();

    if (pathname !== "/") {
      window.location.href = `/${hash}`;
      return;
    }

    const section = document.querySelector(hash);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setActiveHash(hash);

      window.history.replaceState(null, "", `/${hash}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FileText className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Resume<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {isSignedIn && (
            <Link
              href="/dashboard"
              className={linkClass(isActivePath("/dashboard"))}
            >
              Dashboard
            </Link>
          )}

          {publicLinks.map((link) => (
            <SectionLink
              key={link.href}
              href={link.href}
              className={linkClass(isSectionActive(link.hash))}
              onClick={() => setActiveHash(link.hash)}
            >
              {link.label}
            </SectionLink>
          ))}
        </nav>

        <div className="flex min-w-[230px] items-center justify-end gap-3">
          {!isLoaded ? (
            <div className="flex items-center gap-3">
              <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            </div>
          ) : isSignedIn ? (
            <>
              <Button
                asChild
                variant={isActivePath("/analyze") ? "default" : "outline"}
                className="hidden sm:inline-flex"
              >
                <Link href="/analyze">Analyze Resume</Link>
              </Button>

              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Login</Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
