'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UvgLogo, Wordmark } from './brand';
import { RoleBadge } from './ui';
import { useAuth } from './useAuth';

const nav = [
  { href: '/dashboard', label: 'Panel' },
  { href: '/tickets', label: 'Tickets' },
  { href: '/admin', label: 'Usuarios y roles', adminOnly: true },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, ready, logout } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-uvg-deep">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-uvg-mint" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--paper)]">
      <aside className="on-dark sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-uvg-deep text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <Link href="/dashboard" className="block">
            <Wordmark />
          </Link>
          <div className="mt-4 border-t border-white/10 pt-4">
            <UvgLogo className="h-[26px] w-auto" />
          </div>
        </div>
        <nav className="flex-1 px-4 py-5">
          <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-white/35">
            Operación
          </div>
          <ul className="space-y-0.5">
            {nav
              .filter((n) => !n.adminOnly || user?.role === 'admin')
              .map((n) => {
                const active = pathname.startsWith(n.href);
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      className={`relative block rounded-md px-3 py-2 text-sm font-medium transition ${
                        active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-uvg-mint" />}
                      {n.label}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3 px-3 py-1.5">
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-white">{user?.fullName}</div>
              <div className="mt-1"><RoleBadge role={user?.role ?? 'viewer'} /></div>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-2 w-full rounded-md px-3 py-2 text-left text-sm font-medium text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 bg-uvg-deep px-4 py-3 lg:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <Wordmark />
            <span className="hidden h-6 w-px shrink-0 bg-white/20 sm:block" aria-hidden />
            <UvgLogo className="hidden h-6 w-auto sm:block" />
          </div>
          <button onClick={logout} className="shrink-0 text-sm font-medium text-white/70">
            Salir
          </button>
        </header>

        <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</div>

        <footer className="border-t border-uvg-green/10 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
            <UvgLogo variant="ink" className="h-7 w-auto opacity-80" />
            <p className="text-xs text-uvg-graphite/55">
              Entorno de práctica intencionalmente vulnerable · úsalo solo en local o staging autorizado.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
