export function SkeletonStat() {
  return (
    <div className="p-6 border border-border-space rounded-[6px] bg-space-surface">
      <div className="skeleton h-8 w-20 mb-2" />
      <div className="skeleton h-4 w-24" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="p-6 border border-border-space rounded-[6px] bg-space-surface">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-2/3 mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-[4px]" />
        <div className="skeleton h-6 w-12 rounded-[4px]" />
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton h-4"
          style={{ width: `${85 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonHeatmap() {
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: 20 }).map((_, weekIdx) => (
        <div key={weekIdx} className="flex flex-col gap-[3px]">
          {Array.from({ length: 7 }).map((_, dayIdx) => (
            <div
              key={dayIdx}
              className="skeleton w-3 h-3 rounded-[2px]"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonBar() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-2 flex-1 rounded-full" />
          <div className="skeleton h-4 w-10" />
        </div>
      ))}
    </div>
  );
}
