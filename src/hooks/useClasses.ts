import { useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/lib/api';
import { fetchClasses } from '@/services/classes';

export function useClasses() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['classes'],
    queryFn: fetchClasses,
  });

  return {
    classes: data ?? [],
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refetch,
  };
}
