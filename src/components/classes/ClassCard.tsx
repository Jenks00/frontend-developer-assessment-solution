import Link from 'next/link';
import { ArrowUpRight, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Class } from '@/types/api';

export function ClassCard({ schoolClass }: { schoolClass: Class }) {
  return (
    <Link href={`/classes/${schoolClass.id}`} className="group block">
      <Card className="h-full transition-colors group-hover:ring-primary/40">
        <CardContent className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              {schoolClass.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {schoolClass.id}
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="size-3.5" aria-hidden />
              {schoolClass.studentIds.length}{' '}
              {schoolClass.studentIds.length === 1 ? 'student' : 'students'}
            </p>
          </div>
          <ArrowUpRight
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </CardContent>
      </Card>
    </Link>
  );
}
