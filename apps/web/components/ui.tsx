'use client';
import React from 'react';

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'subtle' | 'danger';
  size?: 'sm' | 'md';
};

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-uvg-mint disabled:cursor-not-allowed disabled:opacity-50 active:translate-y-px';
  const sizes = { sm: 'h-8 px-3 text-[13px]', md: 'h-10 px-4 text-sm' };
  const variants = {
    primary: 'bg-uvg-green text-white shadow-card hover:bg-uvg-hover',
    ghost: 'text-uvg-deep hover:bg-uvg-green/8',
    subtle: 'bg-white text-uvg-deep ring-1 ring-uvg-green/15 hover:ring-uvg-green/30 hover:bg-uvg-green/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-card',
  };
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />;
}

export function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-xl bg-white shadow-card ring-1 ring-uvg-green/8 ${className}`}>{children}</div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-uvg-deep/80">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-uvg-graphite/70">{hint}</span>}
    </label>
  );
}

export const inputCls =
  'w-full rounded-lg border border-uvg-green/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-uvg-graphite/40 transition focus:border-uvg-green focus:ring-2 focus:ring-uvg-mint/40 focus:outline-none';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputCls} {...props} />;
}

const statusMap: Record<string, { label: string; cls: string }> = {
  open: { label: 'Abierto', cls: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  in_progress: { label: 'En progreso', cls: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  closed: { label: 'Cerrado', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
};
const prioMap: Record<string, { label: string; cls: string }> = {
  low: { label: 'Baja', cls: 'bg-slate-100 text-slate-600 ring-slate-500/20' },
  medium: { label: 'Media', cls: 'bg-sky-50 text-sky-700 ring-sky-600/20' },
  high: { label: 'Alta', cls: 'bg-orange-50 text-orange-700 ring-orange-600/20' },
  urgent: { label: 'Urgente', cls: 'bg-red-50 text-red-700 ring-red-600/20' },
};

export function StatusPill({ status }: { status: string }) {
  const s = statusMap[status] ?? { label: status, cls: 'bg-slate-100 text-slate-600 ring-slate-500/20' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.cls}`}>
      {s.label}
    </span>
  );
}
export function PriorityPill({ priority }: { priority: string }) {
  const p = prioMap[priority] ?? { label: priority, cls: 'bg-slate-100 text-slate-600 ring-slate-500/20' };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${p.cls}`}>
      {p.label}
    </span>
  );
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    admin: 'bg-uvg-mint/25 text-uvg-deep ring-uvg-green/25',
    agent: 'bg-white/15 text-white ring-white/25',
    viewer: 'bg-white/10 text-white/80 ring-white/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset ${map[role] ?? map.viewer}`}>
      {role}
    </span>
  );
}
