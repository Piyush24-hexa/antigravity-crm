'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Users, Building2, HandCoins, Kanban, BarChart3, Settings, Zap,
  Mail, Bot, ChevronLeft, ChevronRight, Search, Bell, Plus,
  Shield, Briefcase, User, Clock, Calendar, FileText, LayoutDashboard,
  ShoppingCart, Receipt, CreditCard, Factory
} from 'lucide-react';
import { useAppStore, type UserRole } from '../../lib/store';

type NavItem = { href: string; label: string; icon: any; roles: UserRole[] };

const navItems: NavItem[] = [
  { href: '/overview', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'manager', 'employee'] },
  { href: '/contacts', label: 'Contacts', icon: Users, roles: ['admin', 'manager', 'employee'] },
  { href: '/companies', label: 'Companies', icon: Building2, roles: ['admin', 'manager', 'employee'] },
  { href: '/deals', label: 'Deals', icon: HandCoins, roles: ['admin', 'manager', 'employee'] },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban, roles: ['admin', 'manager'] },
  { href: '/sales-orders', label: 'Sales Orders', icon: ShoppingCart, roles: ['admin', 'manager', 'employee'] },
  { href: '/production', label: 'Production', icon: Factory, roles: ['admin', 'manager'] },
  { href: '/invoices', label: 'Invoices', icon: Receipt, roles: ['admin', 'manager'] },
  { href: '/payments', label: 'Payments', icon: CreditCard, roles: ['admin', 'manager'] },
  { href: '/inbox', label: 'Inbox', icon: Mail, roles: ['admin', 'manager', 'employee'] },
  { href: '/timesheets', label: 'Timesheets', icon: Clock, roles: ['admin', 'manager', 'employee'] },
  { href: '/daily-report', label: 'Daily Report', icon: FileText, roles: ['admin', 'manager', 'employee'] },
  { href: '/manager-view', label: 'Manager View', icon: LayoutDashboard, roles: ['admin', 'manager'] },
  { href: '/reports/gantt', label: 'Team Gantt', icon: Calendar, roles: ['admin', 'manager'] },
  { href: '/reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'manager'] },
  { href: '/automation', label: 'Automation', icon: Zap, roles: ['admin'] },
  { href: '/copilot', label: 'AI Copilot', icon: Bot, roles: ['admin', 'manager', 'employee'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin'] },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { role, setRole } = useAppStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ─── Sidebar ─── */}
      <aside
        className={`flex flex-col border-r border-surface-200 bg-surface-50 transition-all duration-300 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-purple flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-base font-bold gradient-text">Antigravity</h1>
              <p className="text-[10px] text-surface-500 -mt-0.5">CRM that thinks</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-2 animate-fade-in">
            <button className="btn-primary w-full text-sm">
              <Plus size={16} />
              Quick Add
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {mounted && visibleNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="px-3 py-3 border-t border-surface-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-ghost w-full justify-center"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-surface-200 bg-surface-50/80 backdrop-blur-xl flex items-center justify-between px-6">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" />
              <input
                type="text"
                placeholder="Search contacts, deals, companies..."
                className="input-field pl-9 py-2 text-sm"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-surface-500 bg-surface-200 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="btn-ghost relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
            </button>
            
            {/* Role Switcher */}
            {mounted && (
              <div className="flex items-center bg-surface-100 p-1 rounded-lg border border-surface-200">
                <button 
                  onClick={() => setRole('admin')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${role === 'admin' ? 'bg-white shadow text-brand-500' : 'text-surface-500 hover:text-surface-900'}`}
                >
                  <Shield size={12} /> Admin
                </button>
                <button 
                  onClick={() => setRole('manager')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${role === 'manager' ? 'bg-white shadow text-brand-500' : 'text-surface-500 hover:text-surface-900'}`}
                >
                  <Briefcase size={12} /> Manager
                </button>
                <button 
                  onClick={() => setRole('employee')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1 ${role === 'employee' ? 'bg-white shadow text-brand-500' : 'text-surface-500 hover:text-surface-900'}`}
                >
                  <User size={12} /> Employee
                </button>
              </div>
            )}

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
