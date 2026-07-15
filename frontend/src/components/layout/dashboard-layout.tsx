'use client';

import { Sidebar } from './sidebar';
import { AuthGuard } from './auth-guard';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 pt-16 lg:pt-0">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
