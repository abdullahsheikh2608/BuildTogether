export default function FullScreenLoader() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      <span className="font-mono text-xs uppercase tracking-widest text-paper-faint">
        Loading blueprint…
      </span>
    </div>
  );
}
