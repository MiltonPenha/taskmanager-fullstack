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
      setError('Informe um email válido e senha com pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const auth = await loginUser({ email, password });
      saveAuth(auth);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="relative grid min-h-screen lg:grid-cols-[1fr_1.08fr]">
        <div className="flex min-h-[42vh] items-center justify-center bg-white px-6 py-12 lg:min-h-screen">
          <div className="text-center">
            <img src="/logo.png" alt="Task Manager" className="mx-auto h-72 w-72 object-contain md:h-96 md:w-96" />
          </div>
        </div>

        <div className="relative flex min-h-[58vh] items-center justify-center bg-meadow px-6 py-12 lg:min-h-screen lg:pl-24">
          <div className="absolute inset-y-0 -left-24 hidden w-56 skew-x-[-13deg] bg-meadow lg:block" />

          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-meadow-soft">Acesse sua conta</p>
              <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Login</h1>
              <p className="mt-2 text-sm text-green-50">Use suas credenciais para continuar.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-white/30 bg-coral-soft px-4 py-3 text-sm font-medium text-coral">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-white">
                Email
                <input
                  className="h-12 rounded-lg border border-white/30 bg-white px-4 text-ink outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/30"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Seu@email.com"
                  autoComplete="email"
                />
              </label>

              <label className="grid gap-2 text-sm font-semibold text-white">
                Senha
                <input
                  className="h-12 rounded-lg border border-white/30 bg-white px-4 text-ink outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/30"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="current-password"
                />
              </label>
            </div>

            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
              Entrar
            </button>

            <p className="mt-6 text-center text-sm text-green-50">
              Ainda não tem conta?{' '}
              <Link className="font-bold text-white hover:underline" href="/register">
                Cadastre-se
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
