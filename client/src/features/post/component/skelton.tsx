export const PostSkeleton = () => (
  <div className="grid grid-cols-3 gap-0.5">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="aspect-square bg-gray-100 animate-pulse"
        style={{ animationDelay: `${i * 60}ms` }}
      />
    ))}
  </div>
);