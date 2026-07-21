# VONANA

**Pessoas. Comunidades. Negócios.**

Fundação técnica do Milestone 1 da plataforma VONANA — uma rede social, de comunidades e de
comércio para Moçambique. Este repositório contém apenas a base (autenticação, perfil, shell da
aplicação e design system); as funcionalidades sociais, marketplace e de comunidades serão
construídas em milestones futuros sobre esta fundação.

## 1. Visão geral do projeto

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Estilos:** Tailwind CSS, com um sistema de design centralizado (`src/config/brand.ts`)
- **Base de dados:** PostgreSQL via Prisma ORM
- **Autenticação:** Auth.js (NextAuth v4) com credenciais (email/username + palavra-passe)
- **Validação:** Zod + React Hook Form
- **Idioma:** Português de Moçambique (arquitectura pronta para i18n futuro)

## 2. Requisitos

- Node.js 20 ou superior
- npm 10 ou superior
- Docker Desktop (para correr o PostgreSQL localmente)
- Git

## 3. Instalar dependências

```bash
npm install
```

## 4. Configurar o PostgreSQL localmente (Docker)

O `docker-compose.yml` inclui um serviço `db` pronto a usar:

```bash
docker compose up -d db
```

Isto inicia um PostgreSQL 16 em `localhost:5432` com:

- utilizador: `vonana`
- password: `vonana_dev_password`
- base de dados: `vonana`

Se preferir, pode usar uma instância PostgreSQL já instalada localmente — basta ajustar
`DATABASE_URL` no passo seguinte.

## 5. Variáveis de ambiente

Copie o ficheiro de exemplo e edite os valores:

```bash
cp .env.example .env
```

Gere um `NEXTAUTH_SECRET` seguro:

```bash
openssl rand -base64 32
```

(No Windows/PowerShell, pode gerar um valor aleatório equivalente, ou usar o Git Bash.)

## 6. Executar as migrações do Prisma

Com o PostgreSQL a correr e o `.env` configurado:

```bash
npx prisma migrate dev --name init
```

Isto cria as tabelas (`users`, `accounts`, `sessions`, `verification_tokens`,
`password_reset_tokens`) e gera o Prisma Client.

## 7. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação fica disponível em [http://localhost:3000](http://localhost:3000).

## 8. Criar o primeiro utilizador administrador

```bash
npm run seed
```

Isto cria uma conta de administrador para testes locais:

- **Email:** `admin@vonana.co.mz`
- **Username:** `admin`
- **Password:** `Admin123!`

> Altere esta password imediatamente em qualquer ambiente que não seja puramente local.

Também pode criar uma conta normal directamente pela interface em `/registar`.

## 9. Build para produção

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

## 10. Notas de implantação futura (Ubuntu VPS + Docker + Nginx)

Este projeto já está preparado para essa implantação:

1. `next.config.mjs` usa `output: 'standalone'`, o que gera um servidor Node.js mínimo em
   `.next/standalone` — ideal para imagens Docker pequenas.
2. O `Dockerfile` incluído faz build multi-stage (`deps` → `build` → `runner`) e corre a
   aplicação como utilizador não-root na porta `3000`.
3. O `docker-compose.yml` inclui um perfil `production` com o serviço `app` já ligado ao
   `db`. Na VPS:
   ```bash
   docker compose --profile production up -d --build
   ```
4. Coloque o Nginx como proxy reverso à frente do container `app` (porta 3000), com TLS via
   Let's Encrypt/Certbot.
5. Defina `NEXTAUTH_URL` para o domínio de produção (ex: `https://vonana.co.mz`) e gere um
   `NEXTAUTH_SECRET` novo e forte só para produção.
6. Quando for adicionado armazenamento de ficheiros em produção, `src/lib/media.ts` é o único
   ficheiro que precisa de ser actualizado para apontar para um serviço compatível com S3.

---

## Estrutura do projeto

```
vonana/
├── prisma/
│   ├── schema.prisma        # Modelos: User, Account, Session, VerificationToken, PasswordResetToken
│   └── seed.ts               # Cria o primeiro utilizador administrador
├── public/
│   └── brand/                 # Logótipos e ícones oficiais VONANA
├── src/
│   ├── app/
│   │   ├── (auth)/            # entrar, registar, esqueci-password, redefinir-password
│   │   ├── (app)/              # shell autenticado: home, perfil, e placeholders "Em breve"
│   │   ├── api/auth/[...nextauth]/route.ts
│   │   ├── layout.tsx, page.tsx (landing pública), providers.tsx, globals.css
│   ├── components/
│   │   ├── ui/                 # Button, Input, Textarea, Avatar, Card, Modal, Dropdown,
│   │   │                        # Badge, Tabs, LoadingSpinner, Skeleton, EmptyState
│   │   └── layout/              # Sidebar, MobileNav, TopBar, RightSidebar, Logo, Theme*
│   ├── features/
│   │   ├── auth/                # schemas.ts (Zod) + actions.ts (Server Actions)
│   │   └── profile/             # schemas.ts + actions.ts
│   ├── config/
│   │   ├── brand.ts             # Nome, tagline, cores, tipografia, caminhos de logótipo
│   │   ├── geography.ts         # Províncias de Moçambique
│   │   └── routes.ts            # Navegação principal e mobile
│   ├── lib/
│   │   ├── prisma.ts, auth.ts, hash.ts, utils.ts, media.ts
│   └── types/next-auth.d.ts
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Modelos de base de dados criados

- **User** — perfil, credenciais, papel (`Role`), estado da conta (`AccountStatus`), género,
  data de nascimento, província, cidade.
- **Account / Session / VerificationToken** — modelos exigidos pelo adaptador Prisma do
  Auth.js (prontos para futuros fornecedores OAuth).
- **PasswordResetToken** — suporta o fluxo de recuperação de palavra-passe.

Enums: `Role` (USER, CREATOR, SELLER, ADMIN, SUPER_ADMIN), `AccountStatus` (ACTIVE, SUSPENDED,
BANNED, PENDING), `Gender`, `Province` (as 11 províncias de Moçambique).

Propositadamente **não** foram criados os modelos `Post`, `Comment`, `Marketplace`, `Group` ou
`Shop` — pertencem a milestones futuros.

## Rotas criadas

| Rota | Descrição |
|---|---|
| `/` | Página pública (landing) |
| `/entrar` | Login |
| `/registar` | Criação de conta |
| `/esqueci-password` | Pedido de recuperação de password |
| `/redefinir-password?token=...` | Definir nova password |
| `/home` | Feed inicial (protegida) |
| `/profile` | Perfil do utilizador (protegida) |
| `/profile/edit` | Editar perfil (protegida) |
| `/explore`, `/people`, `/communities`, `/marketplace`, `/shops`, `/messages`, `/notifications`, `/create` | Placeholders "Em breve" (protegidas) |

## Comandos úteis

```bash
npm run dev            # servidor de desenvolvimento
npm run build           # build de produção
npm run start            # servidor de produção
npm run lint              # ESLint
npm run typecheck          # verificação de tipos TypeScript
npm run prisma:studio       # explorador visual da base de dados
npm run prisma:migrate       # nova migração Prisma
npm run seed                  # criar utilizador administrador
```

## Passos de configuração restantes

- Ligar um fornecedor de email transaccional para o fluxo de recuperação de password (por
  agora, o link é apenas escrito na consola do servidor em desenvolvimento).
- Implementar o upload real de imagens (foto de perfil/capa) através de `src/lib/media.ts`.
- Configurar Nginx + TLS na VPS Ubuntu para produção.
