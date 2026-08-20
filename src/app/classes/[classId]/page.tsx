'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Search, Users, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { buttonVariants } from '@/components/ui/button';
import { StudentTable } from '@/components/students/StudentTable';
import { EnrollStudentDialog } from '@/components/students/EnrollStudentDialog';
import { RemoveStudentDialog } from '@/components/students/RemoveStudentDialog';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useClass } from '@/hooks/useClass';
import { useClassStudents } from '@/hooks/useClassStudents';
import { useDebounce } from '@/hooks/useDebounce';
import type { Student } from '@/types/api';

const LAST_CLASS_KEY = 'schoolhouse:last-class-id';

export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(
    null
  );

  const {
    schoolClass,
    isLoading: classLoading,
    error: classError,
    refetch: refetchClass,
  } = useClass(classId);
  const {
    students,
    total,
    isLoading: studentsLoading,
    error: studentsError,
    refetch: refetchStudents,
  } = useClassStudents(classId, debouncedSearch);

  useEffect(() => {
    if (schoolClass) {
      window.localStorage.setItem(LAST_CLASS_KEY, schoolClass.id);
    }
  }, [schoolClass]);

  function handleMutated() {
    refetchClass();
    refetchStudents();
  }

  if (classLoading) {
    return <LoadingState label="Loading class…" />;
  }

  if (classError || !schoolClass) {
    return (
      <ErrorState
        message={classError ?? 'This class could not be found.'}
        onRetry={classError ? refetchClass : undefined}
        action={
          <Link
            href="/classes"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Back to classes
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/classes"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          All classes
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              {schoolClass.name}
            </h1>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{schoolClass.id}</span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" aria-hidden />
                {schoolClass.studentIds.length}{' '}
                {schoolClass.studentIds.length === 1 ? 'student' : 'students'}
              </span>
            </div>
          </div>
          <EnrollStudentDialog
            classId={schoolClass.id}
            enrolledIds={schoolClass.studentIds}
            onEnrolled={handleMutated}
          />
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search
          className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or student ID"
          className="pl-8"
          aria-label="Search students in this class"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            aria-label="Clear search"
            className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {studentsError ? (
        <ErrorState message={studentsError} onRetry={refetchStudents} />
      ) : studentsLoading ? (
        <LoadingState label="Loading students…" />
      ) : students.length === 0 ? (
        <EmptyState
          icon={debouncedSearch ? Search : Users}
          title={
            debouncedSearch ? 'No matching students' : 'No students enrolled'
          }
          description={
            debouncedSearch
              ? `Nobody in ${schoolClass.name} matches "${debouncedSearch}".`
              : 'Enroll a student to get this class started.'
          }
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {total} {total === 1 ? 'student' : 'students'}
            {debouncedSearch ? ` matching "${debouncedSearch}"` : ''}
          </p>
          <StudentTable
            students={students}
            classId={schoolClass.id}
            onRemove={setStudentToRemove}
          />
        </>
      )}

      <RemoveStudentDialog
        classId={schoolClass.id}
        student={studentToRemove}
        onOpenChange={(open) => {
          if (!open) setStudentToRemove(null);
        }}
        onRemoved={handleMutated}
      />
    </div>
  );
}
