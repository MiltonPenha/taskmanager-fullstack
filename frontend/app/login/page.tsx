'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, LogIn } from 'lucide-react';
import { loginUser } from '../../lib/api';
import { saveAuth } from '../../lib/auth-storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.includes('@') || password.length < 6) {
      setError('Informe um email valido e senha com pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const auth = await loginUser({ email, password });
      saveAuth(auth);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-wheat px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[260px] flex-col justify-between bg-ink p-8 text-white md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">Task Manager</p>
            <h1 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">Entre para gerenciar suas tarefas</h1>
          </div>
          <p className="mt-8 max-w-md text-sm leading-6 text-gray-300">
            Acesso protegido com JWT e tarefas vinculadas ao usuario autenticado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 md:p-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">Login</h2>
            <p className="mt-1 text-sm text-gray-500">Use suas credenciais para continuar.</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Email
            <input
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Senha
            <input
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimo 6 caracteres"
              autoComplete="current-password"
            />
          </label>

          <button
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow/90 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            Entrar
          </button>

          <p className="text-center text-sm text-gray-600">
            Ainda nao tem conta?{' '}
            <Link className="font-semibold text-meadow hover:underline" href="/register">
              Cadastre-se
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

