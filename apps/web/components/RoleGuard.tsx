'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAppStore, type UserRole } from '../lib/store';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { role } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  if (!allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 bg-accent-red/10 rounded-full flex items-center justify-center">
          <ShieldAlert className="text-accent-red" size={40} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-surface-900 mb-2">Access Denied</h1>
          <p className="text-surface-500 max-w-md mx-auto">
            Your current role ({role.toUpperCase()}) does not have permission to view this page.
          </p>
        </div>
        <Link href="/contacts" className="btn-primary">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
