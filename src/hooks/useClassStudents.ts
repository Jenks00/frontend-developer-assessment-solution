import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import { fetchClassStudents } from '@/services/classes';

export function useClassStudents(classId: string, search: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['classes', classId, 'students', search],
    queryFn: () => fetchClassStudents(classId, search || undefined),
    enabled: Boolean(classId),
  });

  return {
    students: data?.data ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
