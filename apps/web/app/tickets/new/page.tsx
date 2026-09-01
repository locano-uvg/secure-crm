'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppShell } from '@/components/AppShell';
import { Button, Card, Field, inputCls } from '@/components/ui';
import { api } from '@/lib/api';
import type { TicketStatus, TicketPriority } from '@secure-crm/shared';

export default function NewTicket() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium' as TicketPriority, status: 'open' as TicketStatus,
    customerName: '', customerEmail: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const created = await api.createTicket(form);
      router.push(`/tickets/${created.id}`);
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  const set = (k: string) => (e: any) => setForm({ ...form, [k]: e.target.value });

  return (
    <AppShell>
      <Link href="/tickets" className="mb-5 inline-block text-sm font-medium text-uvg-green hover:underline">
        ← Volver a tickets
      </Link>
      <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight text-ink">Nuevo ticket</h1>

      <Card className="max-w-2xl p-6">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Asunto">
            <input className={inputCls} required value={form.title} onChange={set('title')} placeholder="Resumen del problema" />
          </Field>
          <Field label="Descripción">
            <textarea className={`${inputCls} min-h-32 resize-y`} value={form.description} onChange={set('description')} placeholder="Detalle de la solicitud" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Cliente">
              <input className={inputCls} value={form.customerName} onChange={set('customerName')} placeholder="Nombre del cliente" />
            </Field>
            <Field label="Correo del cliente">
              <input className={inputCls} type="email" value={form.customerEmail} onChange={set('customerEmail')} placeholder="cliente@correo.com" />
            </Field>
            <Field label="Prioridad">
              <select className={inputCls} value={form.priority} onChange={set('priority')}>
                <option value="low">Baja</option><option value="medium">Media</option>
                <option value="high">Alta</option><option value="urgent">Urgente</option>
              </select>
            </Field>
            <Field label="Estado">
              <select className={inputCls} value={form.status} onChange={set('status')}>
                <option value="open">Abierto</option><option value="in_progress">En progreso</option>
                <option value="closed">Cerrado</option>
              </select>
            </Field>
          </div>
          {error && <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? 'Creando…' : 'Crear ticket'}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
