'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Cake,
  Calendar,
  Mail,
  Phone,
  School,
  UserRound,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { StatusBadge } from '@/components/students/StatusBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { useStudent } from '@/hooks/useStudent';
import { useClasses } from '@/hooks/useClasses';
import { calculateAge, formatDate, fullName } from '@/lib/format';

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-4" aria-hidden />
      </span>
      <div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const searchParams = useSearchParams();
  const fromClassId = searchParams.get('from');

  const { student, isLoading, error, refetch } = useStudent(studentId);
  const { classes } = useClasses();

  const enrolledClass =
    classes.find((c) => c.id === fromClassId) ??
    classes.find((c) => c.studentIds.includes(studentId));

  const backHref = fromClassId ? `/classes/${fromClassId}` : '/classes';

  if (isLoading) {
    return <LoadingState label="Loading student…" />;
  }

  if (error || !student) {
    return (
      <ErrorState
        message={error ?? 'This student could not be found.'}
        onRetry={error ? refetch : undefined}
        action={
          <Link
            href={backHref}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            {fromClassId ? 'Back to class' : 'Back to classes'}
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={backHref}
        className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        {fromClassId ? 'Back to class' : 'Back to classes'}
      </Link>

      <Card>
        <CardContent className="flex flex-wrap items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-lg font-semibold text-primary">
            {student.firstName[0]}
            {student.lastName[0]}
          </span>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
              {fullName(student)}
            </h1>
            <p className="text-sm text-muted-foreground">{student.id}</p>
          </div>
          <StatusBadge status={student.status} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid grid-cols-1 gap-x-6 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
          <div className="divide-y divide-border sm:col-span-1">
            <DetailRow
              icon={Cake}
              label="Date of birth"
              value={`${formatDate(student.dateOfBirth)} (age ${calculateAge(student.dateOfBirth)})`}
            />
            <DetailRow icon={UserRound} label="Gender" value={
              <span className="capitalize">{student.gender}</span>
            } />
            <DetailRow
              icon={School}
              label="Class"
              value={enrolledClass ? enrolledClass.name : 'Not currently enrolled'}
            />
          </div>
          <div className="divide-y divide-border sm:col-span-1">
            <DetailRow icon={Mail} label="Email" value={student.email} />
            <DetailRow icon={Phone} label="Phone" value={student.phone} />
            <DetailRow
              icon={Calendar}
              label="Enrollment date"
              value={formatDate(student.enrollmentDate)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
