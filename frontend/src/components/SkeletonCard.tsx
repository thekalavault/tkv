export function SkeletonArtworkCard({ className = "" }: { className?: string; key?: string | number }) {
  return (
    <div className={`flex flex-col items-center justify-between text-center w-full p-2 sm:p-3 ${className}`}>
      {/* Frameless Dynamic Image Skeleton */}
      <div className="w-full flex items-center justify-center">
        <div className="w-[220px] sm:w-[250px] md:w-[270px] h-[280px] sm:h-[320px] md:h-[360px] bg-stone-300/40 animate-pulse relative overflow-hidden rounded-[3px] shadow-[0_10px_30px_rgba(30,23,20,0.06)]">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
        </div>
      </div>

      {/* Typography Skeleton */}
      <div className="mt-4 flex flex-col items-center justify-center space-y-2 w-full px-2">
        <div className="w-36 h-4 bg-stone-300/50 rounded-sm animate-pulse" />
        <div className="w-24 h-3.5 bg-stone-300/40 rounded-sm animate-pulse" />
        <div className="pt-1.5 flex flex-col items-center space-y-1">
          <div className="w-20 h-2 bg-[#C5A059]/30 rounded-sm animate-pulse" />
          <div className="w-24 h-3 bg-stone-300/50 rounded-sm animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonFeaturedCard({ layoutClass = "" }: { layoutClass?: string }) {
  return (
    <div className={`relative overflow-hidden bg-stone-200/30 rounded-xl border border-outline/5 ${layoutClass} h-[350px] md:h-auto`}>
      <div className="absolute inset-0 bg-stone-200/50 animate-pulse" />
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      
      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-white/30 rounded-sm" />
          <div className="w-20 h-3 bg-white/30 rounded-sm" />
        </div>
        <div className="space-y-3 my-auto flex flex-col items-center">
          <div className="w-48 h-6 bg-white/30 rounded-sm" />
          <div className="w-32 h-3 bg-white/30 rounded-sm" />
          <div className="w-64 h-3 bg-white/30 rounded-sm" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-24 h-8 bg-white/30 rounded-sm" />
          <div className="w-24 h-4 bg-white/30 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
