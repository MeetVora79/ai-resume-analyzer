import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "ResumeAI - AI Resume Analyzer",
  description: "Analyze your resume with AI and improve your ATS score.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}