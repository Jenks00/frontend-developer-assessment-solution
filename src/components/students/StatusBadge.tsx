import { Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Student } from '@/types/api';

export function StatusBadge({ status }: { status: Student['status'] }) {
  const isActive = status === 'active';

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 border-transparent capitalize',
        isActive
          ? 'bg-accent/15 text-accent'
          : 'bg-muted text-muted-foreground'
      )}
    >
      <Circle
        className={cn(
          'size-1.5 fill-current',
          isActive ? 'text-accent' : 'text-muted-foreground'
        )}
        aria-hidden
      />
      {status}
    </Badge>
  );
}
