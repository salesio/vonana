import Link from 'next/link';
import Image from 'next/image';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  href?: string;
  /** Show only the speech-bubble symbol, without the wordmark. */
  symbolOnly?: boolean;
}

export function Logo({ className, href = '/', symbolOnly = false }: LogoProps) {
  return (
    <Link href={href} className={cn('flex items-center gap-2.5', className)}>
      <span className="relative h-9 w-9 shrink-0">
        <Image src={brand.logos.symbol} alt={`${brand.name} símbolo`} fill className="object-contain" priority />
      </span>
      {!symbolOnly && (
        <span className="text-lg font-bold tracking-tight text-navy dark:text-offwhite">
          {brand.name}
        </span>
      )}
    </Link>
  );
}
