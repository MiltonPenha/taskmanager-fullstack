'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Loader2, UserPlus } from 'lucide-react';
import { registerUser } from '../../lib/api';
import { saveAuth } from '../../lib/auth-storage';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.');
      return;
    }

    if (!email.includes('@') || password.length < 6) {
      setError('Informe um email valido e senha com pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const auth = await registerUser({ name: name.trim(), email, password });
      saveAuth(auth);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel cadastrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-wheat px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-soft md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[260px] flex-col justify-between bg-meadow p-8 text-white md:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-wheat">Task Manager</p>
            <h1 className="mt-6 text-3xl font-bold leading-tight md:text-5xl">Crie sua conta</h1>
          </div>
          <p className="mt-8 max-w-md text-sm leading-6 text-green-50">
            Cada usuario visualiza e altera somente as tarefas criadas por ele.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 md:p-8">
          <div>
            <h2 className="text-2xl font-bold text-ink">Cadastro</h2>
            <p className="mt-1 text-sm text-gray-500">Preencha os dados para iniciar.</p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <label className="grid gap-2 text-sm font-medium text-gray-700">
            Nome
            <input
              className="h-11 rounded-lg border border-gray-300 px-3 outline-none transition focus:border-meadow focus:ring-2 focus:ring-meadow/20"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
            />
          </label>

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
              autoComplete="new-password"
            />
          </label>

          <button
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
            Criar conta
          </button>

          <p className="text-center text-sm text-gray-600">
            Ja tem conta?{' '}
            <Link className="font-semibold text-meadow hover:underline" href="/login">
              Entrar
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

