// shadcn toast compat: project uses sonner directly (see ui/sonner).
// Re-export no-op so any stale imports compile without exploding.
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;