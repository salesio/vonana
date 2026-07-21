import Link from 'next/link';
import Image from 'next/image';
import { Users, Layers, ShoppingBag, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { brand } from '@/config/brand';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Logo } from '@/components/layout/Logo';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-offwhite dark:bg-navy-700">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <div className="flex items-center gap-3">
          <Link href="/entrar" className="text-sm font-medium text-navy-400 hover:text-navy dark:text-navy-100">
            Entrar
          </Link>
          <Link href="/registar">
            <Button size="sm">Criar conta</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-vonana-radial" aria-hidden="true" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 text-center md:py-24">
          <Badge variant="turquoise" className="gap-1.5">
            <Sparkles size={12} /> A nova plataforma de Moçambique
          </Badge>

          <div className="relative h-24 w-24 md:h-32 md:w-32">
            <Image src={brand.logos.symbol} alt={brand.name} fill className="object-contain" priority />
          </div>

          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-navy dark:text-offwhite md:text-6xl">
            {brand.name}
          </h1>
          <p className="max-w-xl text-lg font-medium text-electric md:text-xl">{brand.tagline}</p>
          <p className="max-w-2xl text-base text-navy-400 dark:text-navy-100 md:text-lg">
            {brand.shortDescription}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/registar">
              <Button size="lg" className="gap-2">
                Criar conta grátis <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/entrar">
              <Button size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why VONANA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-navy dark:text-offwhite">Porquê VONANA?</h2>
          <p className="mt-2 text-navy-300">Tudo o que precisa para se conectar e crescer, num só lugar.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: 'Feito para Moçambique',
              text: 'Pensado desde o início para as pessoas, línguas e realidades das nossas províncias.',
              color: 'text-electric bg-electric/10',
            },
            {
              icon: ShieldCheck,
              title: 'Confiança em primeiro lugar',
              text: 'Perfis verificados, moderação séria e um espaço seguro para toda a comunidade.',
              color: 'text-turquoise bg-turquoise/10',
            },
            {
              icon: ShoppingBag,
              title: 'De conversas a negócios',
              text: 'Da rede social ao marketplace — conecte-se, participe e venda, tudo na mesma plataforma.',
              color: 'text-orange bg-orange/10',
            },
          ].map((item) => (
            <Card key={item.title} className="flex flex-col gap-3">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon size={20} />
              </span>
              <h3 className="text-lg font-semibold text-navy dark:text-offwhite">{item.title}</h3>
              <p className="text-sm text-navy-300">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pessoas / Comunidades / Negócios */}
      <section className="bg-white py-16 dark:bg-navy-600/40">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <Badge variant="electric" className="mb-3">Pessoas</Badge>
              <h3 className="mb-2 text-xl font-semibold text-navy dark:text-offwhite">
                Conecte-se com quem importa
              </h3>
              <p className="text-sm text-navy-300">
                Crie o seu perfil, siga amigos e familiares e acompanhe o que acontece à sua volta,
                de Maputo a Cabo Delgado.
              </p>
            </div>
            <div>
              <Badge variant="turquoise" className="mb-3">Comunidades</Badge>
              <h3 className="mb-2 text-xl font-semibold text-navy dark:text-offwhite">
                Junte-se a quem partilha os seus interesses
              </h3>
              <p className="text-sm text-navy-300">
                Participe em comunidades sobre os temas que ama — desde tecnologia a empreendedorismo
                e cultura moçambicana.
              </p>
            </div>
            <div>
              <Badge variant="orange" className="mb-3">Negócios</Badge>
              <h3 className="mb-2 text-xl font-semibold text-navy dark:text-offwhite">
                Compre e venda com confiança
              </h3>
              <p className="text-sm text-navy-300">
                Descubra lojas locais e produtos no marketplace, ou crie a sua própria página de
                negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace preview */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-navy dark:text-offwhite">Marketplace VONANA</h2>
            <p className="mt-2 text-navy-300">Uma pré-visualização do que aí vem.</p>
          </div>
          <Badge variant="outline">Em breve</Badge>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Capulana artesanal', price: '850 MT', seller: 'Loja Nima Nima' },
            { name: 'Serviço de fotografia', price: 'A partir de 2.000 MT', seller: 'Foco Studio Maputo' },
            { name: 'Café da Zambézia — 500g', price: '320 MT', seller: 'Mercado Central' },
            { name: 'Aulas de programação', price: '1.500 MT/mês', seller: 'Dev Moçambique' },
          ].map((product) => (
            <Card key={product.name} className="flex flex-col gap-2">
              <div className="mb-1 h-28 w-full rounded-xl bg-vonana-gradient opacity-90" />
              <p className="text-sm font-semibold text-navy dark:text-offwhite">{product.name}</p>
              <p className="text-sm font-medium text-electric">{product.price}</p>
              <p className="text-xs text-navy-300">{product.seller}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Card className="flex flex-col items-center gap-5 bg-vonana-gradient p-10 text-center text-white">
          <Layers size={28} />
          <h2 className="text-2xl font-bold md:text-3xl">Faça parte da VONANA</h2>
          <p className="max-w-lg text-white/85">
            Crie a sua conta gratuita hoje e comece a construir a sua presença em Moçambique.
          </p>
          <Link href="/registar">
            <Button size="lg" variant="secondary" className="gap-2 bg-white text-electric hover:bg-white/90">
              Criar conta <ArrowRight size={18} />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-50 py-10 dark:border-navy-600">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-navy-300 sm:flex-row">
          <Logo symbolOnly className="opacity-80" />
          <p>&copy; {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</p>
          <p>{brand.social.supportEmail}</p>
        </div>
      </footer>
    </div>
  );
}
