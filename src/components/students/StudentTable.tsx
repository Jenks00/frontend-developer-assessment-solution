import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/students/StatusBadge';
import { calculateAge, fullName } from '@/lib/format';
import type { Student } from '@/types/api';

export function StudentTable({
  students,
  classId,
  onRemove,
}: {
  students: Student[];
  classId: string;
  onRemove: (student: Student) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Student</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            return (
              <TableRow key={student.id}>
                <TableCell>
                  <Link
                    href={`/students/${student.id}?from=${classId}`}
                    className="font-medium text-foreground hover:text-primary hover:underline underline-offset-4"
                  >
                    {fullName(student)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {student.id}
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">
                  {student.gender}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {calculateAge(student.dateOfBirth)}
                </TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(student)}
                    aria-label={`Remove ${fullName(student)} from class`}
                  >
                    <Trash2 className="size-3.5" aria-hidden />
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
