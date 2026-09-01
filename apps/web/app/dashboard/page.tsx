'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { AppShell } from '@/components/AppShell';
import { Card, StatusPill, PriorityPill } from '@/components/ui';
import { StatusDonut, BarRow } from '@/components/charts';
import { api } from '@/lib/api';
import { useAuth } from '@/components/useAuth';
import type { DashboardStats } from '@secure-crm/shared';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.dashboard().then(setStats).catch((e) => setError(e.message));
  }, []);

  const kpis = stats
    ? [
        { label: 'Total de tickets', value: stats.totalTickets, dot: '#04602f' },
        { label: 'Abiertos', value: stats.byStatus.open, dot: '#2563eb' },
        { label: 'En progreso', value: stats.byStatus.in_progress, dot: '#d97706' },
        { label: 'Cerrados', value: stats.byStatus.closed, dot: '#059669' },
      ]
    : [];

  const maxPrio = stats ? Math.max(...Object.values(stats.byPriority)) : 0;
  const maxAgent = stats ? Math.max(...stats.byAgent.map((a) => a.count)) : 0;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          Hola, {user?.fullName?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-uvg-graphite/70">Resumen de la operación de soporte.</p>
      </div>

      {error && <Card className="mb-6 p-4 text-sm text-red-700">No se pudieron cargar las métricas: {error}</Card>}

      <div className="grid grid-cols-2 divide-uvg-green/10 overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-uvg-green/8 sm:grid-cols-4 sm:divide-x">
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="border-uvg-green/10 p-5 [&:nth-child(1)]:border-r [&:nth-child(1)]:border-b sm:[&:nth-child(1)]:border-b-0 [&:nth-child(2)]:border-b sm:[&:nth-child(2)]:border-b-0 [&:nth-child(3)]:border-r sm:[&:nth-child(3)]:border-r-0"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: k.dot }} />
              <span className="text-[13px] text-uvg-graphite/70">{k.label}</span>
            </div>
            <div className="tabular mt-2 font-display text-[2rem] font-semibold leading-none tracking-tight text-ink">
              {k.value}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Tickets por estado</h2>
          {stats && (
            <StatusDonut
              data={[
                { label: 'Abiertos', value: stats.byStatus.open, color: '#2563eb' },
                { label: 'En progreso', value: stats.byStatus.in_progress, color: '#d97706' },
                { label: 'Cerrados', value: stats.byStatus.closed, color: '#059669' },
              ]}
            />
          )}
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Por prioridad</h2>
          <div className="space-y-3">
            {stats &&
              (['urgent', 'high', 'medium', 'low'] as const).map((p) => (
                <BarRow
                  key={p}
                  label={{ urgent: 'Urgente', high: 'Alta', medium: 'Media', low: 'Baja' }[p]}
                  value={stats.byPriority[p]}
                  max={maxPrio}
                  color={{ urgent: '#dc2626', high: '#ea580c', medium: '#0284c7', low: '#64748b' }[p]}
                />
              ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Carga por agente</h2>
          <div className="space-y-3">
            {stats?.byAgent.map((a) => (
              <BarRow key={a.assigneeName} label={a.assigneeName.split(' ')[0]} value={a.count} max={maxAgent} color="#04602f" />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-uvg-green/8 px-5 py-4">
          <h2 className="text-sm font-semibold text-ink">Tickets recientes</h2>
          <Link href="/tickets" className="text-[13px] font-medium text-uvg-green hover:underline">Ver todos</Link>
        </div>
        <ul className="divide-y divide-uvg-green/8">
          {stats?.recent.map((t) => (
            <li key={t.id}>
              <Link href={`/tickets/${t.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-uvg-green/4">
                <span className="tabular w-10 shrink-0 font-mono text-xs text-uvg-graphite/45">#{t.id}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{t.title}</span>
                <span className="hidden sm:block"><PriorityPill priority={t.priority} /></span>
                <StatusPill status={t.status} />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
