'use client';

import { useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Copy, LinkIcon, MailCheck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { AppShell } from '@/components/app-shell';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { requestMagicLink } from '@/lib/api';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.email('Informe um e-mail valido.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [sent, setSent] = useState<null | {
    email: string;
    previewUrl: string;
    expiresAt: string;
  }>(null);
  const [error, setError] = useState('');
  const [copyFeedback, setCopyFeedback] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'felipe@aggrandize.com',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setError('');
    setCopyFeedback('');

    try {
      const response = await requestMagicLink(values.email);
      setSent({
        email: values.email,
        previewUrl: response.previewUrl,
        expiresAt: response.expiresAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar link');
    }
  }

  return (
    <AppShell active="login">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="brand-panel border-[rgba(var(--brand-violet),0.16)] text-white">
          <CardHeader>
            <CardTitle className="font-display text-3xl text-white">Login com link mágico</CardTitle>
            <CardDescription className="text-white/78">
              Simule um fluxo realista de autenticação sem depender de backend ou provedor de
              e-mail. O token é persistido localmente só para o ambiente da demonstração.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 text-sm text-white/80">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-white">Sugestão de navegação</p>
              <p className="mt-2">
                Use um e-mail como <strong>felipe@aggrandize.com</strong> e percorra o fluxo para
                mostrar validação, feedback de sucesso e redirecionamento controlado.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-white">Comportamentos implementados</p>
              <ul className="mt-3 space-y-2">
                <li>· Validação com Zod e React Hook Form</li>
                <li>· Estado persistido com Zustand</li>
                <li>· Link de acesso simulado e expiração controlada</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="font-medium text-white">Perfis prontos para demonstração</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'felipe@aggrandize.com',
                  'design@aggrandize.com',
                  'ops@aggrandize.com',
                ].map((email) => (
                  <button
                    key={email}
                    type="button"
                    onClick={() => setValue('email', email, { shouldValidate: true })}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                  >
                    {email}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrar no ambiente</CardTitle>
            <CardDescription>
              Informe seu e-mail para gerar um link de acesso. Nenhum envio real de e-mail é realizado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-[rgba(var(--brand-teal),0.25)] bg-white p-5">
                  <div className="flex items-start gap-3">
                    <MailCheck className="mt-0.5 h-5 w-5 text-[rgb(var(--brand-teal))]" />
                    <div>
                      <p className="font-medium text-[rgb(var(--brand-teal))]">Link de acesso criado com sucesso</p>
                      <p className="mt-1 text-sm text-slate-700">
                        Acesso pronto para <strong>{sent.email}</strong>. O link expira em{' '}
                        {new Intl.DateTimeFormat('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(new Date(sent.expiresAt))}
                        .
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-900">Abrir link mágico simulado</p>
                  <p className="mt-2 text-sm text-slate-600">
                    Use o link abaixo para concluir a autenticação exatamente como faria em um
                    fluxo real.
                  </p>
                  <code className="mt-4 block overflow-x-auto rounded-xl bg-white px-4 py-3 text-xs text-slate-700">
                    {sent.previewUrl}
                  </code>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={sent.previewUrl} className={cn(buttonVariants({ variant: 'default' }))}>
                    Abrir link
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(sent.previewUrl);
                      setCopyFeedback('Link copiado com sucesso.');
                      window.setTimeout(() => setCopyFeedback(''), 2500);
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar link
                  </Button>
                  <Button variant="outline" onClick={() => setSent(null)}>
                    Gerar novo link
                  </Button>
                </div>

                {copyFeedback && (
                  <div className="rounded-2xl border border-[rgba(var(--brand-blue),0.16)] bg-[rgba(var(--brand-blue),0.06)] px-4 py-3 text-sm text-[rgb(var(--brand-blue))]">
                    {copyFeedback}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[rgb(var(--brand-blue))]">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="felipe@aggrandize.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-[rgb(var(--brand-magenta))]">{errors.email.message}</p>
                  )}
                </div>

                {error && (
                  <div className="rounded-2xl border border-[rgba(var(--brand-magenta),0.18)] bg-[rgba(var(--brand-magenta),0.08)] px-4 py-3 text-sm text-[rgb(var(--brand-magenta))]">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Gerando link...' : 'Gerar link mágico'}
                </Button>

                <p className="text-center text-sm text-slate-500">
                  Não quer simular login agora?{' '}
                  <Link href="/dashboard" className="font-medium text-[rgb(var(--brand-violet))] underline">
                    Entrar em modo de visualização
                  </Link>
                  .
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
