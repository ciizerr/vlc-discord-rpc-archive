import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";

export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col relative z-0 bg-black">
      <MediaNavigation />
      
      {/* Hero Skeleton (Plex layout) */}
      <div className="relative w-full h-[50vh] md:h-[65vh] bg-zinc-900 border-b border-white/5 animate-pulse" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-24 md:-mt-48 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 pb-12">
        <div className="w-40 md:w-64 shrink-0 rounded-xl overflow-hidden aspect-[2/3] bg-zinc-800 border border-white/10 shadow-2xl animate-pulse" />
        <div className="flex-1 w-full md:mb-4 animate-pulse">
           <div className="h-6 w-1/3 bg-zinc-800 rounded mb-2" />
           <div className="h-12 md:h-16 w-3/4 bg-zinc-800 rounded mb-4" />
           <div className="h-24 w-full bg-zinc-800 rounded" />
        </div>
      </div>

      {/* Cast Skeleton */}
      <div className="container mx-auto px-4 md:px-8 py-12 flex-1">
        <div className="h-8 w-32 bg-zinc-800 rounded-md mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col animate-pulse">
              <div className="aspect-[2/3] w-full rounded-lg bg-zinc-800 mb-3" />
              <div className="h-4 w-3/4 bg-zinc-800 rounded-md mb-2" />
              <div className="h-3 w-1/2 bg-zinc-800 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <MediaFooter />
    </main>
  );
}
