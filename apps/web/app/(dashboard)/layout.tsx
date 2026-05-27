'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Users, Building2, HandCoins, Kanban, BarChart3, Settings, Zap,
  Mail, Bot, Search, Bell, Plus, Shield,
  Clock, Calendar, FileText, LayoutDashboard,
  ShoppingCart, Receipt, CreditCard, Factory,
  ChevronLeft, ChevronRight, PanelLeftClose, PanelLeft
} from 'lucide-react';
import { useAppStore, type UserRole } from '../../lib/store';

type NavItem = { href: string; label: string; icon: any; roles: UserRole[]; section?: string };

const navItems: NavItem[] = [
  { href: '/overview',      label: 'Overview',       icon: LayoutDashboard, roles: ['admin','manager','employee','production_manager','research','design','manufacturing'] },

  // CRM
  { href: '/contacts',      label: 'Contacts',        icon: Users,          roles: ['admin','manager','employee'], section: 'CRM' },
  { href: '/companies',     label: 'Companies',       icon: Building2,      roles: ['admin','manager','employee'] },
  { href: '/deals',         label: 'Deals',           icon: HandCoins,      roles: ['admin','manager','employee'] },
  { href: '/pipeline',      label: 'Pipeline',        icon: Kanban,         roles: ['admin','manager'] },

  // Sales
  { href: '/sales-orders',  label: 'Sales Orders',    icon: ShoppingCart,   roles: ['admin','manager','employee'], section: 'Sales' },
  { href: '/invoices',      label: 'Invoices',        icon: Receipt,        roles: ['admin','manager'] },
  { href: '/payments',      label: 'Payments',        icon: CreditCard,     roles: ['admin','manager'] },

  // Operations
  { href: '/production',    label: 'Production',      icon: Factory,        roles: ['admin','manager','production_manager','research','design','manufacturing','employee'], section: 'Operations' },
  { href: '/timesheets',    label: 'Timesheets',      icon: Clock,          roles: ['admin','manager','employee'] },
  { href: '/daily-report',  label: 'Daily Report',    icon: FileText,       roles: ['admin','manager','employee'] },

  // Management
  { href: '/manager-view',  label: 'Manager View',    icon: LayoutDashboard,roles: ['admin','manager'], section: 'Management' },
  { href: '/reports/gantt', label: 'Team Gantt',      icon: Calendar,       roles: ['admin','manager'] },
  { href: '/reports',       label: 'Reports',         icon: BarChart3,      roles: ['admin','manager'] },

  // Tools
  { href: '/inbox',         label: 'Inbox',           icon: Mail,           roles: ['admin','manager','employee'], section: 'Tools' },
  { href: '/automation',    label: 'Automation',      icon: Zap,            roles: ['admin'] },
  { href: '/copilot',       label: 'AI Copilot',      icon: Bot,            roles: ['admin','manager','employee'] },
  { href: '/settings',      label: 'Settings',        icon: Settings,       roles: ['admin'] },
];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Main Manager',
  production_manager: 'Prod. Manager',
  research: 'Research',
  design: 'Design',
  manufacturing: 'Manufacturing',
  employee: 'Employee',
};

const ROLE_COLORS: Record<UserRole, string> = {
  admin:              'bg-purple-500',
  manager:            'bg-blue-500',
  production_manager: 'bg-teal-500',
  research:           'bg-cyan-500',
  design:             'bg-pink-500',
  manufacturing:      'bg-orange-500',
  employee:           'bg-slate-500',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { role, setRole } = useAppStore();

  useEffect(() => { setMounted(true); }, []);

  const visibleNavItems = navItems.filter(item => item.roles.includes(role));

  // Group items by section
  const sections: { label: string; items: NavItem[] }[] = [];
  let currentSection: { label: string; items: NavItem[] } | null = null;

  for (const item of visibleNavItems) {
    if (item.section || !currentSection) {
      currentSection = { label: item.section || '', items: [] };
      sections.push(currentSection);
    }
    currentSection.items.push(item);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f0f4f8]">

      {/* ─── Sidebar ─── */}
      <aside
        style={{ background: 'var(--sidebar-bg)' }}
        className={`flex flex-col border-r border-white/5 transition-all duration-300 ease-in-out flex-shrink-0 ${
          collapsed ? 'w-[64px]' : 'w-[248px]'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[60px] border-b border-white/5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
               style={{ background: 'linear-gradient(135deg, #0ab5a0, #0284c7)' }}>
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <div className="font-bold text-white text-sm tracking-tight">Antigravity</div>
              <div className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>Enterprise CRM</div>
            </div>
          )}
        </div>

        {/* New button */}
        {!collapsed && (
          <div className="px-3 pt-4 pb-2">
            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold text-white transition-all duration-150"
                    style={{ background: '#0ab5a0' }}>
              <Plus size={14} />
              Quick Add
            </button>
          </div>
        )}
        {collapsed && (
          <div className="px-2 pt-4 pb-2">
            <button className="w-full flex items-center justify-center p-2 rounded-lg text-white transition-all"
                    style={{ background: '#0ab5a0' }}>
              <Plus size={15} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {mounted && sections.map((section, si) => (
            <div key={si}>
              {section.label && !collapsed && (
                <div className="section-heading">{section.label}</div>
              )}
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon size={16} className="flex-shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="px-2 pb-3 pt-2 border-t border-white/5 flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="sidebar-link w-full justify-center"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft size={15} /> : <PanelLeftClose size={15} />}
            {!collapsed && <span className="text-xs">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ─── Header ─── */}
        <header className="h-[60px] flex-shrink-0 flex items-center justify-between px-5 bg-white border-b border-[#e2e8f0]"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Search */}
          <div className="flex items-center gap-2 w-full max-w-[380px]">
            <div className="relative w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-9 pr-12 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/15 transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Role Switcher */}
            {mounted && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[role]}`} />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="text-xs font-semibold text-slate-700 bg-transparent outline-none cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Main Manager</option>
                  <option value="production_manager">Production Manager</option>
                  <option value="research">Research Team</option>
                  <option value="design">Design Team</option>
                  <option value="manufacturing">Manufacturing Team</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            )}

            {/* Notification */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-transparent hover:border-slate-200">
              <Bell size={16} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2 ml-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                   style={{ background: 'linear-gradient(135deg, #0ab5a0, #0284c7)' }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* ─── Page Content ─── */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
