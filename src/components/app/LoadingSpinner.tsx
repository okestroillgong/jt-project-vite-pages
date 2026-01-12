
export function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
