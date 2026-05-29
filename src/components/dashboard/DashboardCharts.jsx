"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function DashboardCharts({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return null;
  }

  const scoreDistribution = [
    {
      range: "0-49",
      count: chartData.filter((item) => item.atsScore >= 0 && item.atsScore < 50)
        .length,
    },
    {
      range: "50-69",
      count: chartData.filter((item) => item.atsScore >= 50 && item.atsScore < 70)
        .length,
    },
    {
      range: "70-89",
      count: chartData.filter((item) => item.atsScore >= 70 && item.atsScore < 90)
        .length,
    },
    {
      range: "90-100",
      count: chartData.filter((item) => item.atsScore >= 90).length,
    },
  ];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>ATS Score Trend</CardTitle>
          <CardDescription>
            Track how your resume score changes over time.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="atsScore"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score Distribution</CardTitle>
          <CardDescription>
            See how your reports are distributed by ATS score range.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}