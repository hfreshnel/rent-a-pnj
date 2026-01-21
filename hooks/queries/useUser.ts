import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UpdateUserInput } from '@/types';
import { getUser, updateUser, updateUserRole, addXP } from '@/services/api/users';
import { useAuthStore } from '@/stores';

// Query keys
export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
  current: () => [...userKeys.all, 'current'] as const,
};

// Get user by ID
export function useUser(userId: string | undefined) {
  return useQuery({
    queryKey: userKeys.detail(userId || ''),
    queryFn: () => getUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get current user
export function useCurrentUser() {
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: userKeys.current(),
    queryFn: async () => {
      if (!firebaseUser) return null;
      const user = await getUser(firebaseUser.uid);
      if (user) {
        setUser(user);
      }
      return user;
    },
    enabled: !!firebaseUser,
    staleTime: 5 * 60 * 1000,
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useMutation({
    mutationFn: async (input: UpdateUserInput) => {
      if (!firebaseUser) throw new Error('Not authenticated');
      await updateUser(firebaseUser.uid, input);
      return getUser(firebaseUser.uid);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.current(), data);
        queryClient.setQueryData(userKeys.detail(data.id), data);
        useAuthStore.getState().setUser(data);
      }
    },
  });
}

// Update user role mutation
export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useMutation({
    mutationFn: async ({
      role,
      pnjProfileId,
    }: {
      role: 'player' | 'pnj' | 'both';
      pnjProfileId?: string;
    }) => {
      if (!firebaseUser) throw new Error('Not authenticated');
      await updateUserRole(firebaseUser.uid, role, pnjProfileId);
      return getUser(firebaseUser.uid);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.current(), data);
        queryClient.setQueryData(userKeys.detail(data.id), data);
        useAuthStore.getState().setUser(data);
      }
    },
  });
}

// Add XP mutation
export function useAddXP() {
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((state) => state.firebaseUser);

  return useMutation({
    mutationFn: async (amount: number) => {
      if (!firebaseUser) throw new Error('Not authenticated');
      await addXP(firebaseUser.uid, amount);
      return getUser(firebaseUser.uid);
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(userKeys.current(), data);
        useAuthStore.getState().setUser(data);
      }
    },
  });
}
