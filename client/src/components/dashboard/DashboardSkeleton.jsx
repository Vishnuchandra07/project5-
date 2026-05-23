const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse rounded-lg bg-surface-200 ${className}`} />
);

const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-8 w-48" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <SkeletonBlock className="h-10 w-36" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="card">
          <SkeletonBlock className="mb-3 h-4 w-24" />
          <SkeletonBlock className="h-9 w-20" />
        </div>
      ))}
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="card lg:col-span-2">
        <SkeletonBlock className="mb-4 h-5 w-40" />
        <SkeletonBlock className="h-[280px] w-full" />
      </div>
      <div className="card space-y-3">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card">
        <SkeletonBlock className="mb-4 h-5 w-48" />
        <SkeletonBlock className="h-[280px] w-full" />
      </div>
      <div className="card space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DashboardSkeleton;
