import { LoadingSpinner } from "./loading-spinner"

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Yuklanmoqda..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
} 