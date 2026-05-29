"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DownloadReportButton() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <Button variant="outline" onClick={handleDownload} className="no-print hover:cursor-pointer">
      <Download className="mr-2 h-4 w-4" />
      Download PDF
    </Button>
  );
}