import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t py-6">
      <Container className="flex flex-col items-center justify-center gap-3 text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} ResumeAI. All rights reserved.</p>
      </Container>
    </footer>
  );
}