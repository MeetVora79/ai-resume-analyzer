"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "./Container";
import SectionLink from "@/components/shared/SectionLink";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { FileText, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

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
  const [open, setOpen] = useState(false);

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

  const isSectionActive = (hash) => pathname === "/" && activeHash === hash;

  const linkClass = (active) =>
    `relative text-sm font-semibold transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:rounded-full after:bg-primary after:transition-all ${
      active
        ? "text-foreground after:w-full"
        : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"
    }`;

  const mobileLinkClass = (active) =>
    `flex items-center rounded-xl px-4 py-3 mx-2 text-sm font-semibold transition ${
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;

  const closeMobileMenu = () => {
    setOpen(false); 
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <FileText className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold tracking-tight">
            Resume<span className="text-primary">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-7 md:flex">
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

          {isSignedIn && (
            <Link
              href="/dashboard"
              className={linkClass(isActivePath("/dashboard"))}
            >
              Dashboard
            </Link>
          )}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden min-w-[230px] items-center justify-end gap-3 md:flex">
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

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {isLoaded && isSignedIn && <UserButton />}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[88%] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                      <FileText className="h-5 w-5" />
                    </div>

                    <span className="text-xl font-bold tracking-tight">
                      Resume<span className="text-primary">AI</span>
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col gap-1">
                {publicLinks.map((link) => (
                  <SectionLink
                    key={link.href}
                    href={link.href}
                    className={mobileLinkClass(isSectionActive(link.hash))}
                    onClick={() => {
                      setActiveHash(link.hash);
                      closeMobileMenu();
                    }}
                  >
                    {link.label}
                  </SectionLink>
                ))}

                {isLoaded && isSignedIn && (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={closeMobileMenu}
                      className={mobileLinkClass(isActivePath("/dashboard"))}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/analyze"
                      onClick={closeMobileMenu}
                      className={mobileLinkClass(isActivePath("/analyze"))}
                    >
                      Analyze Resume
                    </Link>
                  </>
                )}
              </div>

              <div className="mt-8 border-t pt-6 mx-3">
                {!isLoaded ? (
                  <div className="space-y-3">
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                    <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                  </div>
                ) : 
                isSignedIn ? (
                  <div className="rounded-2xl border bg-muted/40 p-4">
                    <p className="text-sm font-medium">You are signed in</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Manage your account using the profile icon.
                    </p>
                  </div>
                ) :
                 (
                  <div className="grid gap-3">
                    <SheetClose asChild>
                      <SignInButton mode="modal">
                        <Button variant="outline" className="w-full">
                          Login
                        </Button>
                      </SignInButton>
                    </SheetClose>

                    <SheetClose asChild>
                      <SignUpButton mode="modal">
                        <Button className="w-full">Get Started</Button>
                      </SignUpButton>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}
