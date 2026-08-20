'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Search, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { useStudents } from '@/hooks/useStudents';
import { getErrorMessage } from '@/lib/api';
import { fullName } from '@/lib/format';
import { enrollStudent } from '@/services/classes';
import { cn } from '@/lib/utils';

export function EnrollStudentDialog({
  classId,
  enrolledIds,
  onEnrolled,
}: {
  classId: string;
  enrolledIds: string[];
  onEnrolled: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { students, isLoading, error: loadError, refetch } = useStudents(open);

  const availableStudents = useMemo(() => {
    const enrolledSet = new Set(enrolledIds);
    const q = query.trim().toLowerCase();
    return students
      .filter((student) => !enrolledSet.has(student.id))
      .filter(
        (student) =>
          !q ||
          fullName(student).toLowerCase().includes(q) ||
          student.id.toLowerCase().includes(q)
      );
  }, [students, enrolledIds, query]);

  function reset() {
    setQuery('');
    setSelectedId(null);
    setError(null);
  }

  async function handleEnroll() {
    if (!selectedId) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await enrollStudent(classId, selectedId);
      setIsSubmitting(false);
      setOpen(false);
      reset();
      onEnrolled();
    } catch (err) {
      setIsSubmitting(false);
      setError(getErrorMessage(err));
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (isSubmitting) return;
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <UserPlus className="size-3.5" aria-hidden />
            Enroll student
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll a student</DialogTitle>
          <DialogDescription>
            Pick an existing student to add to this class.
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or student ID"
            className="pl-8"
            aria-label="Search students to enroll"
          />
        </div>

        <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
          {isLoading ? (
            <LoadingState label="Loading students…" className="border-0 py-10" />
          ) : loadError ? (
            <ErrorState message={loadError} onRetry={refetch} className="border-0 py-10" />
          ) : availableStudents.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              No students match &ldquo;{query}&rdquo;, or everyone is already
              enrolled.
            </p>
          ) : (
            <ul>
              {availableStudents.map((student) => {
                const isSelected = selectedId === student.id;
                return (
                  <li key={student.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(student.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        'flex w-full items-center justify-between gap-2 border-b border-border px-3 py-2 text-left text-sm last:border-b-0 hover:bg-muted',
                        isSelected && 'bg-primary/10'
                      )}
                    >
                      <span>
                        <span className="block font-medium text-foreground">
                          {fullName(student)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {student.id}
                        </span>
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          className="size-4 shrink-0 text-primary"
                          aria-hidden
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={!selectedId || isSubmitting}
            onClick={handleEnroll}
          >
            {isSubmitting ? 'Enrolling…' : 'Enroll student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
