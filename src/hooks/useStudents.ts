import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import { fetchStudents } from '@/services/students';

export function useStudents(enabled = true) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudents,
    enabled,
  });

  return {
    students: data?.data ?? [],
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
