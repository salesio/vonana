'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Camera } from 'lucide-react';
import { editProfileSchema, type EditProfileInput } from '@/features/profile/schemas';
import { updateProfile } from '@/features/profile/actions';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { MOZAMBIQUE_PROVINCES } from '@/config/geography';

interface EditProfileFormProps {
  user: {
    fullName: string;
    displayName: string;
    username: string;
    bio: string;
    province?: string;
    city: string;
    avatarUrl: string | null;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: user,
  });

  async function onSubmit(data: EditProfileInput) {
    setFormError(null);
    setSaved(false);
    const result = await updateProfile(data);
    if (!result.success) {
      setFormError(result.error);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar name={user.fullName} src={user.avatarUrl} size="lg" />
          <div>
            <Button type="button" variant="outline" size="sm" disabled className="gap-1.5">
              <Camera size={14} /> Alterar foto
            </Button>
            <p className="mt-1 text-xs text-navy-300">Disponível numa próxima actualização.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nome completo" error={errors.fullName?.message} {...register('fullName')} />
          <Input label="Nome de exibição" error={errors.displayName?.message} {...register('displayName')} />
        </div>

        <Input label="Username" error={errors.username?.message} {...register('username')} />

        <Textarea
          label="Bio"
          placeholder="Fale um pouco sobre si..."
          error={errors.bio?.message}
          {...register('bio')}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="province" className="text-sm font-medium text-navy dark:text-offwhite">
              Província
            </label>
            <select
              id="province"
              className="h-11 rounded-xl border border-navy-100 bg-white px-4 text-sm text-navy focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/20 dark:border-navy-500 dark:bg-navy-600 dark:text-offwhite"
              {...register('province')}
            >
              <option value="">Seleccionar...</option>
              {MOZAMBIQUE_PROVINCES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <Input label="Cidade / Distrito" error={errors.city?.message} {...register('city')} />
        </div>

        {formError && <p className="text-sm font-medium text-red-600">{formError}</p>}
        {saved && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-turquoise-dark">
            <CheckCircle2 size={16} /> Perfil actualizado com sucesso.
          </p>
        )}

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Guardar alterações
          </Button>
        </div>
      </form>
    </Card>
  );
}
