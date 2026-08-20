import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import { fetchClass } from '@/services/classes';

export function useClass(classId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['classes', classId],
    queryFn: () => fetchClass(classId),
    enabled: Boolean(classId),
  });

  return {
    schoolClass: data ?? null,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
