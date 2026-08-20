'use client';

import { GraduationCap } from 'lucide-react';
import { ClassCard } from '@/components/classes/ClassCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useClasses } from '@/hooks/useClasses';

export default function ClassesPage() {
  const { classes, isLoading, error, refetch } = useClasses();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Classes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading
            ? 'Loading classes…'
            : `${classes.length} ${classes.length === 1 ? 'class' : 'classes'} currently running`}
        </p>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : isLoading ? (
        <LoadingState label="Loading classes…" />
      ) : classes.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No classes yet"
          description="Classes will show up here once they're created."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((schoolClass) => (
            <ClassCard key={schoolClass.id} schoolClass={schoolClass} />
          ))}
        </div>
      )}
    </div>
  );
}
