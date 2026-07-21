'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { registerSchema, type RegisterInput } from '@/features/auth/schemas';
import { registerUser } from '@/features/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function RegisterForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterInput) {
    setFormError(null);
    const result = await registerUser(data);

    if (!result.success) {
      if (result.field) {
        setError(result.field, { message: result.error });
      } else {
        setFormError(result.error);
      }
      return;
    }

    const signInResult = await signIn('credentials', {
      identifier: data.email,
      password: data.password,
      redirect: false,
    });

    if (signInResult?.error) {
      router.push('/entrar');
      return;
    }

    router.push('/home');
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nome completo"
          placeholder="Ex: Rosa Machel"
          error={errors.fullName?.message}
          {...register('fullName')}
        />
        <Input
          label="Username"
          placeholder="ex: rosa_machel"
          error={errors.username?.message}
          {...register('username')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Palavra-passe"
          type="password"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres, com uma maiúscula e um número."
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar palavra-passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}

        <Button type="submit" isLoading={isSubmitting} className="mt-1">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-300">
        Já tem conta?{' '}
        <Link href="/entrar" className="font-medium text-electric hover:underline">
          Entrar
        </Link>
      </p>
    </Card>
  );
}
