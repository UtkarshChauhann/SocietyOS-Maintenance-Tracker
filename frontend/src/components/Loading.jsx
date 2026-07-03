export const Loading = ({ label = 'Loading' }) => (
  <div className="surface min-h-56 p-5" role="status" aria-live="polite">
    <span className="sr-only">{label}</span>
    <div className="flex items-center gap-3 border-b border-line pb-5">
      <span className="skeleton h-10 w-10 rounded-lg" />
      <div className="grid flex-1 gap-2">
        <span className="skeleton h-4 w-36" />
        <span className="skeleton h-3 w-56 max-w-full" />
      </div>
    </div>
    <div className="grid gap-4 pt-5 sm:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="grid gap-3">
          <span className="skeleton h-3 w-20" />
          <span className="skeleton h-8 w-28" />
          <span className="skeleton h-3 w-full" />
        </div>
      ))}
    </div>
  </div>
);
