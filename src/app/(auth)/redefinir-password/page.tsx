import type { Metadata } from 'next';
import { ResetPasswordForm } from './ResetPasswordForm';

export const metadata: Metadata = { title: 'Redefinir palavra-passe' };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-navy dark:text-offwhite">Definir nova palavra-passe</h1>
      <p className="mb-8 text-sm text-navy-300">Escolha uma nova palavra-passe para a sua conta.</p>
      <ResetPasswordForm token={searchParams.token ?? ''} />
    </div>
  );
}
