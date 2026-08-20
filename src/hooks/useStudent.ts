import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import { fetchStudent } from '@/services/students';

export function useStudent(studentId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students', studentId],
    queryFn: () => fetchStudent(studentId),
    enabled: Boolean(studentId),
  });

  return {
    student: data ?? null,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
