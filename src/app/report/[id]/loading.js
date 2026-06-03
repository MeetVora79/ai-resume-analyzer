import Container from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export default function ReportLoading() {
  return (
    <section className="min-h-[80vh] bg-muted/40 py-16">
      <Container>
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <SkeletonBox className="mb-4 h-6 w-28" />
              <SkeletonBox className="h-10 w-80 max-w-full" />
              <SkeletonBox className="mt-3 h-5 w-96 max-w-full" />
            </div>

            <SkeletonBox className="h-10 w-44" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card>
                <CardHeader>
                  <SkeletonBox className="h-6 w-36" />
                  <SkeletonBox className="mt-2 h-4 w-48" />
                </CardHeader>

                <CardContent className="space-y-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <SkeletonBox className="h-5 w-5 rounded-full" />
                      <div className="flex-1">
                        <SkeletonBox className="h-4 w-24" />
                        <SkeletonBox className="mt-2 h-5 w-full" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <SkeletonBox className="h-6 w-28" />
                  <SkeletonBox className="mt-2 h-4 w-48" />
                </CardHeader>

                <CardContent>
                  <SkeletonBox className="mx-auto h-28 w-28 rounded-full" />
                  <SkeletonBox className="mt-5 h-4 w-full" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <SkeletonBox className="h-6 w-44" />
                    <SkeletonBox className="mt-2 h-4 w-64" />
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <SkeletonBox className="h-4 w-full" />
                    <SkeletonBox className="h-4 w-11/12" />
                    <SkeletonBox className="h-4 w-10/12" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}