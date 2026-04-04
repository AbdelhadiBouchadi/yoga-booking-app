"use client";

export default function DownloadMenuSkeleton() {
  return (
    <section className="relative flex w-full items-center justify-center overflow-hidden py-20 md:py-32">
      {/* Background Skeleton */}
      <div className="bg-muted/10 absolute inset-0 z-0 animate-pulse" />
      <div className="absolute inset-0 z-10 bg-black/20" />

      <div className="relative z-20 container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-md md:p-12">
          {/* Title Pulse */}
          <div className="mx-auto mb-6 h-10 w-3/4 animate-pulse rounded-lg bg-white/20 md:h-12" />

          {/* Description Pulse */}
          <div className="mx-auto mb-8 max-w-2xl space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-white/10" />
          </div>

          {/* Button Pulse */}
          <div className="mx-auto h-12 w-48 animate-pulse rounded-full bg-white/20" />
        </div>
      </div>
    </section>
  );
}
