'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas';
import { requestPasswordReset } from '@/features/auth/actions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(data: ForgotPasswordInput) {
    await requestPasswordReset(data);
    setSent(true);
  }

  if (sent) {
    return (
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="text-turquoise" size={36} />
        <p className="font-medium text-navy dark:text-offwhite">Verifique o seu email</p>
        <p className="text-sm text-navy-300">
          Se existir uma conta com esse endereço, enviámos instruções para redefinir a palavra-passe.
        </p>
        <Link href="/entrar" className="mt-2 text-sm font-medium text-electric hover:underline">
          Voltar para entrar
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="voce@exemplo.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" isLoading={isSubmitting}>
          Enviar instruções
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-navy-300">
        <Link href="/entrar" className="font-medium text-electric hover:underline">
          Voltar para entrar
        </Link>
      </p>
    </Card>
  );
}
