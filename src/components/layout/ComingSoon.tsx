import { Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={Sparkles}
        title={`${title} — Em breve`}
        description="Esta secção está a ser construída e fará parte de um dos próximos milestones da VONANA."
      />
    </div>
  );
}
