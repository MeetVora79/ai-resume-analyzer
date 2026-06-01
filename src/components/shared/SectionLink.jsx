"use client";

import { usePathname } from "next/navigation";

export default function SectionLink({ href, children, className = "", onClick }) {
  const pathname = usePathname();

  const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";

  const handleClick = (e) => {
    if (!hash) return;

    e.preventDefault();

    if (pathname !== "/") {
      window.location.href = href;
      return;
    }

    const section = document.querySelector(hash);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.replaceState(null, "", href);

      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }

    if (onClick) onClick();
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}