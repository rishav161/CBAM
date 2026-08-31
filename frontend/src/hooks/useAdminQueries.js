import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUsersList, createCustomerUser, toggleUserStatus } from '../api/adminApi.js';

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsersList,
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useToggleUserStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
