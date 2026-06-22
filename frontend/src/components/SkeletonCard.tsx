export function SkeletonArtworkCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mb-6 md:mb-8 rounded-[1px] overflow-hidden bg-subtle-smoke/50 border border-outline/5 ${className}`}>
      {/* Aspect Ratio Box (Approximate average) */}
      <div className="w-full aspect-[3/4] bg-stone-200/50 animate-pulse relative overflow-hidden">
        {/* Shimmer gradient */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="p-4 bg-paper-white border-t border-outline/5 space-y-3">
        {/* Title skeleton */}
        <div className="w-3/4 h-5 bg-stone-200/50 rounded-sm animate-pulse" />
        {/* Artist skeleton */}
        <div className="w-1/2 h-3 bg-stone-200/50 rounded-sm animate-pulse" />
        
        <div className="flex justify-between items-center pt-3 border-t border-outline/5 mt-3">
          {/* Tag skeleton */}
          <div className="w-16 h-4 bg-stone-200/50 rounded-sm animate-pulse" />
          {/* Price skeleton */}
          <div className="w-20 h-4 bg-stone-200/50 rounded-sm animate-pulse" />
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
