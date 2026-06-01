"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );

      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
  };

  if (!isVisible) return null;

  return (
    <Button
      type="button"
      size="icon"
      onClick={scrollToTop}
      className="fixed bottom-5 right-5 z-50 h-10 w-10 rounded-full shadow-lg transition hover:-translate-y-1 sm:bottom-6 sm:right-6 sm:h-11 sm:w-11 hidden sm:inline-flex"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
