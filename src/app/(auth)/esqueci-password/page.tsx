import type { Metadata } from 'next';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export const metadata: Metadata = { title: 'Recuperar palavra-passe' };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-navy dark:text-offwhite">Recuperar acesso</h1>
      <p className="mb-8 text-sm text-navy-300">
        Introduza o seu email e enviaremos instruções para redefinir a palavra-passe.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
