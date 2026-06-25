const SectionSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-surface-light rounded-xl" />
          <div className="mt-3 space-y-2">
            <div className="h-4 bg-surface-light rounded w-3/4" />
            <div className="h-3 bg-surface-light rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionSkeleton;
