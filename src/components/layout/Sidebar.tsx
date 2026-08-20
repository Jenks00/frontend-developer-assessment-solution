'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LayoutDashboard, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/classes', label: 'Classes', icon: Users },
];

export function Sidebar({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground',
        className
      )}
    >
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <GraduationCap className="size-4.5" aria-hidden />
        </span>
        <div className="leading-tight">
          <p className="font-heading text-sm font-semibold tracking-tight">
            Schoolhouse
          </p>
          <p className="text-[11px] text-sidebar-foreground/50">
            Admin console
          </p>
        </div>
      </div>

      <div className="mx-4 h-px bg-sidebar-border" />

      <ul className="flex flex-1 flex-col gap-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/' ? pathname === '/' : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground ring-1 ring-sidebar-border'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'size-4 shrink-0',
                    isActive
                      ? 'text-sidebar-primary'
                      : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70'
                  )}
                  aria-hidden
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
