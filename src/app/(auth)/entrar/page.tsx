import type { Metadata } from 'next';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = { title: 'Entrar' };

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-navy dark:text-offwhite">Bem-vindo de volta</h1>
      <p className="mb-8 text-sm text-navy-300">Inicie sessão para continuar na sua rede.</p>
      <LoginForm />
    </div>
  );
}
