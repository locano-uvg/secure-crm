'use client';
import { useEffect, useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { Button, Card, Field, inputCls } from '@/components/ui';
import { api } from '@/lib/api';
import type { User } from '@secure-crm/shared';

const roles = ['admin', 'agent', 'viewer'];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ username: '', email: '', fullName: '', role: 'viewer', password: '' });
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      setUsers(await api.users());
    } catch (e: any) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: number, role: string) {
    await api.setRole(id, role);
    load();
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      await api.createUser(form);
      setForm({ username: '', email: '', fullName: '', role: 'viewer', password: '' });
      load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreating(false);
    }
  }

  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">Usuarios y roles</h1>
        <p className="mt-1 text-sm text-uvg-graphite/70">Administra las cuentas del CRM.</p>
      </div>

      {error && <Card className="mb-4 p-4 text-sm text-red-700">{error}</Card>}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <div className="border-b border-uvg-green/8 px-5 py-4">
            <h2 className="text-sm font-semibold text-ink">Cuentas</h2>
          </div>
          <ul className="divide-y divide-uvg-green/8">
            {users.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center gap-3 px-5 py-3.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-uvg-green/10 text-sm font-semibold text-uvg-green">
                  {u.fullName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink">{u.fullName}</div>
                  <div className="truncate text-xs text-uvg-graphite/60">
                    {u.email} · <span className="font-mono">{u.username}</span>
                  </div>
                </div>
                <select
                  className="h-9 rounded-lg border border-uvg-green/15 bg-white px-2.5 text-[13px] focus:border-uvg-green focus:outline-none focus:ring-2 focus:ring-uvg-mint/40"
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                >
                  {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="h-fit p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Crear usuario</h2>
          <form onSubmit={createUser} className="space-y-3">
            <Field label="Nombre completo">
              <input className={inputCls} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </Field>
            <Field label="Usuario">
              <input className={inputCls} required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </Field>
            <Field label="Correo">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Contraseña">
              <input className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Field>
            <Field label="Rol">
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {roles.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Button type="submit" disabled={creating} className="w-full">
              {creating ? 'Creando…' : 'Crear usuario'}
            </Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
