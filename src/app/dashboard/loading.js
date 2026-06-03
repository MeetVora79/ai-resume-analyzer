import Container from "@/components/shared/Container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SkeletonBox({ className = "" }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <section className="min-h-[80vh] bg-muted/40 py-10">
      <Container>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <SkeletonBox className="mb-3 h-6 w-24" />
            <SkeletonBox className="h-10 w-72" />
            <SkeletonBox className="mt-3 h-5 w-96 max-w-full" />
          </div>

          <SkeletonBox className="h-10 w-44" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="w-full">
                    <SkeletonBox className="h-4 w-28" />
                    <SkeletonBox className="mt-4 h-8 w-20" />
                    <SkeletonBox className="mt-3 h-3 w-36" />
                  </div>

                  <SkeletonBox className="h-12 w-12 rounded-xl" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <SkeletonBox className="h-6 w-44" />
                <SkeletonBox className="mt-2 h-4 w-64" />
              </CardHeader>

              <CardContent>
                <SkeletonBox className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <SkeletonBox className="h-6 w-40" />
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-lg border p-4 md:grid-cols-6"
                >
                  <SkeletonBox className="h-5 md:col-span-2" />
                  <SkeletonBox className="h-5" />
                  <SkeletonBox className="h-5" />
                  <SkeletonBox className="h-5" />
                  <SkeletonBox className="h-5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Container>
    </section>
  );
}