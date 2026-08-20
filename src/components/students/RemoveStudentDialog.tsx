'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/api';
import { fullName } from '@/lib/format';
import { removeStudentFromClass } from '@/services/classes';
import type { Student } from '@/types/api';

export function RemoveStudentDialog({
  classId,
  student,
  onOpenChange,
  onRemoved,
}: {
  classId: string;
  student: Student | null;
  onOpenChange: (open: boolean) => void;
  onRemoved: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!student) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await removeStudentFromClass(classId, student.id);
      setIsSubmitting(false);
      onRemoved();
      onOpenChange(false);
      toast.success(`${fullName(student)} was removed from the class`);
    } catch (err) {
      setIsSubmitting(false);
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    }
  }

  return (
    <Dialog
      open={Boolean(student)}
      onOpenChange={(open) => {
        if (!isSubmitting) onOpenChange(open);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertTriangle className="size-4.5" aria-hidden />
          </div>
          <DialogTitle className="mt-1">Remove student from class</DialogTitle>
          <DialogDescription>
            {student && (
              <>
                <strong className="text-foreground">{fullName(student)}</strong>{' '}
                will be removed from this class. They will remain enrolled at
                the school and can be added back at any time.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? 'Removing…' : 'Remove student'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
