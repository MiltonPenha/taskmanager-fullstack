'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';
import { registerUser } from '../../lib/api';
import { saveAuth } from '../../lib/auth-storage';
import { Toast, ToastMessage } from '../../components/toast';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setToast(null);

    if (name.trim().length < 2) {
      setError('Informe um nome com pelo menos 2 caracteres.');
      return;
    }

    if (!email.includes('@') || password.length < 6) {
      setError('Informe um email válido e senha com pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const auth = await registerUser({ name: name.trim(), email, password });
      saveAuth(auth);
      setToast({ type: 'success', message: 'Cadastro realizado com sucesso.' });
      window.setTimeout(() => router.push('/dashboard'), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <Toast toast={toast} />
      <section className="relative grid min-h-screen lg:grid-cols-[1fr_1.08fr]">
        <div className="flex min-h-[42vh] items-center justify-center bg-white px-6 py-12 lg:min-h-screen">
          <div className="text-center">
            <img src="/logo.png" alt="Task Manager" className="mx-auto h-72 w-72 object-contain md:h-96 md:w-96" />
          </div>
        </div>

        <div className="relative flex min-h-[58vh] items-center justify-center bg-ink px-6 py-12 lg:min-h-screen lg:pl-24">
          <div className="absolute inset-y-0 -left-24 hidden w-56 skew-x-[-13deg] bg-ink lg:block" />

          <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-meadow-soft">Comece agora</p>
              <h1 className="mt-3 text-3xl font-bold text-white md:text-4xl">Cadastro</h1>
              <p className="mt-2 text-sm text-slate-300">Preencha os dados para iniciar.</p>
            </div>

            {error && (
              <div className="mb-5 rounded-lg border border-white/30 bg-coral-soft px-4 py-3 text-sm font-medium text-coral">
                {error}
              </div>
            )}

            <div className="grid gap-4">
              <label className="grid gap-2 text-sm font-semibold text-white">
                Nome
                <input
                  className="h-12 rounded-lg border border-white/30 bg-white px-4 text-ink outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/30"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Seu nome"
                  autoComplete="name"
                />
              </label>

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
                <span className="relative">
                  <input
                    className="h-12 w-full rounded-lg border border-white/30 bg-white px-4 pr-12 text-ink outline-none transition placeholder:text-slate-400 focus:border-white focus:ring-2 focus:ring-white/30"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition hover:bg-canvas hover:text-ink"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </span>
              </label>
            </div>

            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-meadow px-4 font-semibold text-white transition hover:bg-meadow-dark disabled:opacity-60"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
              Criar conta
            </button>

            <p className="mt-6 text-center text-sm text-slate-300">
              Já tem conta?{' '}
              <Link className="font-bold text-white hover:underline" href="/login">
                Entrar
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
