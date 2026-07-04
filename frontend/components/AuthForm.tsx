"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, LockKeyhole, Mail, User } from "lucide-react";
import { z } from "zod";
import { authApi, setToken } from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.")
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Informe seu nome.").max(80)
});

type AuthFormValues = z.infer<typeof registerSchema>;

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isRegister = mode === "register";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: AuthFormValues) {
    setError(null);
    setMessage(null);

    try {
      const response = isRegister
        ? await authApi.register(values)
        : await authApi.login({
            email: values.email,
            password: values.password
          });

      setToken(response.accessToken);
      setMessage(isRegister ? "Conta criada com sucesso." : "Login realizado.");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-line bg-white shadow-soft md:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-[320px] flex-col justify-between bg-ink p-8 text-white">
          <div>
            <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-md bg-brand-500 text-ink">
              <CheckCircle2 aria-hidden size={24} />
            </div>
            <h1 className="text-3xl font-semibold leading-tight">
              Task Manager
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-200">
              Organize tarefas, acompanhe pendencias e mantenha seu fluxo de
              trabalho em dia.
            </p>
          </div>
          <p className="mt-10 text-sm text-slate-300">
            Next.js, NestJS, PostgreSQL, Prisma e JWT.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-ink">
              {isRegister ? "Criar conta" : "Entrar"}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isRegister
                ? "Cadastre seus dados para acessar o painel."
                : "Acesse sua conta para gerenciar tarefas."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-ink">
                  Nome
                </span>
                <span className="relative block">
                  <User
                    aria-hidden
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    className="w-full rounded-md border border-line px-10 py-3 text-sm text-ink shadow-sm transition focus:border-brand-500"
                    placeholder="Milton Penha"
                    {...register("name")}
                  />
                </span>
                {errors.name && (
                  <span className="mt-2 block text-sm text-red-600">
                    {errors.name.message}
                  </span>
                )}
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">
                E-mail
              </span>
              <span className="relative block">
                <Mail
                  aria-hidden
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full rounded-md border border-line px-10 py-3 text-sm text-ink shadow-sm transition focus:border-brand-500"
                  placeholder="voce@email.com"
                  type="email"
                  {...register("email")}
                />
              </span>
              {errors.email && (
                <span className="mt-2 block text-sm text-red-600">
                  {errors.email.message}
                </span>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink">
                Senha
              </span>
              <span className="relative block">
                <LockKeyhole
                  aria-hidden
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  className="w-full rounded-md border border-line px-10 py-3 text-sm text-ink shadow-sm transition focus:border-brand-500"
                  placeholder="******"
                  type="password"
                  {...register("password")}
                />
              </span>
              {errors.password && (
                <span className="mt-2 block text-sm text-red-600">
                  {errors.password.message}
                </span>
              )}
            </label>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="rounded-md border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
                {message}
              </p>
            )}

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <Loader2 aria-hidden size={18} className="animate-spin" />}
              {isRegister ? "Cadastrar" : "Entrar"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            {isRegister ? "Ja possui uma conta?" : "Ainda nao tem conta?"}{" "}
            <Link
              className="font-semibold text-brand-700 hover:text-brand-600"
              href={isRegister ? "/login" : "/register"}
            >
              {isRegister ? "Entrar" : "Criar conta"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

