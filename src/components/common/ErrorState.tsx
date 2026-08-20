import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ErrorState({
  message = 'Something went wrong while loading this data.',
  onRetry,
  action,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 py-16 text-center',
        className
      )}
    >
      <AlertTriangle className="size-5 text-destructive" aria-hidden />
      <p className="max-w-sm text-sm text-foreground/80">{message}</p>
      {(onRetry || action) && (
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
