import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'admin' | 'manager' | 'employee' | 'production_manager' | 'research' | 'design' | 'manufacturing';

interface AppState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'admin', // Default role for demo purposes
      setRole: (role) => set({ role }),
    }),
    {
      name: 'antigravity-role-storage',
    }
  )
);
