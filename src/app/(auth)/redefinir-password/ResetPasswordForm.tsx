'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas';
import { resetPassword } from '@/features/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(data: ResetPasswordInput) {
    setFormError(null);

    if (!token) {
      setFormError('Link inválido. Solicite um novo email de recuperação.');
      return;
    }

    const result = await resetPassword(token, data);
    if (!result.success) {
      setFormError(result.error);
      return;
    }

    router.push('/entrar');
  }

  if (!token) {
    return (
      <Card className="text-center text-sm text-navy-300">
        Link inválido ou em falta.{' '}
        <Link href="/esqueci-password" className="font-medium text-electric hover:underline">
          Solicitar novo link
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nova palavra-passe"
          type="password"
          placeholder="••••••••"
          hint="Mínimo 8 caracteres, com uma maiúscula e um número."
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar nova palavra-passe"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}
        <Button type="submit" isLoading={isSubmitting}>
          Redefinir palavra-passe
        </Button>
      </form>
    </Card>
  );
}
