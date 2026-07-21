import type { Metadata } from 'next';
import { RegisterForm } from './RegisterForm';

export const metadata: Metadata = { title: 'Criar conta' };

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-navy dark:text-offwhite">Criar a sua conta</h1>
      <p className="mb-8 text-sm text-navy-300">Junte-se a Pessoas, Comunidades e Negócios.</p>
      <RegisterForm />
    </div>
  );
}
