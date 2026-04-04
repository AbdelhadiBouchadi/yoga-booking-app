"use client";

export default function InstructorsSkeleton() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Skeleton */}
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <div className="bg-muted/20 mx-auto h-12 w-3/4 animate-pulse rounded-lg md:h-16" />
          <div className="bg-muted/10 mx-auto h-6 w-1/2 animate-pulse rounded-lg" />
        </div>

        {/* Instructors Grid Skeleton (2 Cards) */}
        <div className="grid gap-8 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border-border/40 from-card/60 to-card/20 relative flex flex-col overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm"
            >
              {/* Image Placeholder */}
              <div className="bg-muted/20 h-64 animate-pulse" />

              {/* Content Placeholder */}
              <div className="flex flex-col space-y-6 p-6">
                <div className="space-y-3">
                  <div className="bg-muted/20 h-8 w-1/2 animate-pulse rounded-md" />
                  <div className="bg-muted/10 h-16 w-full animate-pulse rounded-md" />
                </div>

                {/* Specialties Row */}
                <div className="space-y-2">
                  <div className="bg-muted/20 h-4 w-24 animate-pulse rounded" />
                  <div className="flex gap-2">
                    <div className="bg-muted/10 h-6 w-16 animate-pulse rounded-full" />
                    <div className="bg-muted/10 h-6 w-20 animate-pulse rounded-full" />
                  </div>
                </div>

                {/* Button Bottom */}
                <div className="bg-muted/20 h-11 w-full animate-pulse rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
