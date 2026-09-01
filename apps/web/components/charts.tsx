'use client';
import { motion } from 'motion/react';

// Donut de estados: anillos apilados con stroke-dasharray. Data viz real.
export function StatusDonut({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const R = 52;
  const C = 2 * Math.PI * R;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(10,61,31,0.07)" strokeWidth="16" />
        {data.map((d, i) => {
          const len = (d.value / total) * C;
          const el = (
            <motion.circle
              key={d.label}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={`${len} ${C - len}`}
              initial={{ strokeDashoffset: -offset + C }}
              animate={{ strokeDashoffset: -offset }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-uvg-graphite/80">{d.label}</span>
            <span className="tabular font-semibold text-ink">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / (max || 1)) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 shrink-0 text-[13px] text-uvg-graphite/80">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-uvg-green/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <span className="tabular w-6 shrink-0 text-right text-[13px] font-semibold text-ink">{value}</span>
    </div>
  );
}
