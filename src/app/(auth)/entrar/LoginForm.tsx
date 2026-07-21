'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setFormError(null);
    const result = await signIn('credentials', {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setFormError(
        result.error === 'CONTA_INATIVA'
          ? 'A sua conta não está activa. Contacte o suporte.'
          : 'Email/username ou palavra-passe incorrectos.',
      );
      return;
    }

    router.push('/home');
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email ou username"
          placeholder="voce@exemplo.com"
          error={errors.identifier?.message}
          {...register('identifier')}
        />
        <Input
          label="Palavra-passe"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link href="/esqueci-password" className="text-xs font-medium text-electric hover:underline">
            Esqueceu a palavra-passe?
          </Link>
        </div>

        {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

        <Button type="submit" isLoading={isSubmitting} className="mt-1">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-300">
        Ainda não tem conta?{' '}
        <Link href="/registar" className="font-medium text-electric hover:underline">
          Criar conta
        </Link>
      </p>
    </Card>
  );
}
