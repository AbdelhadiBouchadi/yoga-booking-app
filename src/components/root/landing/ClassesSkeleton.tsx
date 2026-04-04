"use client";

export default function ClassesSkeleton() {
  return (
    <section className="relative w-full py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Skeleton */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="bg-muted/20 mx-auto h-12 w-3/4 animate-pulse rounded-lg md:h-16" />
          <div className="bg-muted/10 mx-auto mt-4 h-6 w-1/2 animate-pulse rounded-lg" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border/40 from-card/60 to-card/20 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-0 backdrop-blur-sm"
            >
              {/* Image Area */}
              <div className="bg-muted/20 h-48 animate-pulse" />

              {/* Content Area */}
              <div className="space-y-4 p-6">
                <div className="bg-muted/20 h-8 w-2/3 animate-pulse rounded-md" />
                <div className="space-y-2">
                  <div className="bg-muted/10 h-4 w-full animate-pulse rounded-md" />
                  <div className="bg-muted/10 h-4 w-5/6 animate-pulse rounded-md" />
                </div>

                {/* Icons row */}
                <div className="flex gap-4">
                  <div className="bg-muted/10 h-6 w-12 animate-pulse rounded-full" />
                  <div className="bg-muted/10 h-6 w-12 animate-pulse rounded-full" />
                  <div className="bg-muted/10 h-6 w-12 animate-pulse rounded-full" />
                </div>

                {/* Button */}
                <div className="bg-muted/20 h-10 w-full animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
