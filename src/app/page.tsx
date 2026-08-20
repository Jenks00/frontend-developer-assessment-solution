'use client';

import Link from 'next/link';
import { ArrowUpRight, GraduationCap, School, UserCheck, Users } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { ClassCard } from '@/components/classes/ClassCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useClasses } from '@/hooks/useClasses';
import { useStudents } from '@/hooks/useStudents';

export default function DashboardPage() {
  const {
    classes,
    isLoading: classesLoading,
    error: classesError,
    refetch: refetchClasses,
  } = useClasses();
  const {
    students,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useStudents();

  const isLoading = classesLoading || studentsLoading;
  const error = classesError || studentsError;
  const activeCount = students.filter((s) => s.status === 'active').length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Good to see you
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick snapshot of how the school is doing today.
        </p>
      </div>

      {error ? (
        <ErrorState
          message={error}
          onRetry={() => {
            refetchClasses();
            refetchStudents();
          }}
        />
      ) : isLoading ? (
        <LoadingState label="Loading school overview…" />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard
              label="Total students"
              value={students.length}
              icon={Users}
              hint="Across every class"
            />
            <StatCard
              label="Total classes"
              value={classes.length}
              icon={School}
              hint="Currently running"
            />
            <StatCard
              label="Active students"
              value={activeCount}
              icon={UserCheck}
              hint={`${students.length - activeCount} inactive`}
            />
          </div>

          <section>
            <div className="mb-4 flex items-end justify-between gap-2">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Classes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Jump into a class to view its roster.
                </p>
              </div>
              <Link
                href="/classes"
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                View all
                <ArrowUpRight className="size-3.5" aria-hidden />
              </Link>
            </div>

            {classes.length === 0 ? (
              <EmptyState
                icon={GraduationCap}
                title="No classes yet"
                description="Classes will show up here once they're created."
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classes.slice(0, 6).map((schoolClass) => (
                  <ClassCard key={schoolClass.id} schoolClass={schoolClass} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
