/**
 * Development seed for VONANA Milestone 1 + 2.
 * Run with: npm run seed
 *
 * Creates admin + sample Mozambican users, follows, posts, reactions, comments.
 */
import { PrismaClient, type Province } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

type SeedUser = {
  email: string;
  username: string;
  fullName: string;
  displayName: string;
  bio: string;
  province: Province;
  city: string;
  role?: 'USER' | 'SUPER_ADMIN';
  password: string;
};

const users: SeedUser[] = [
  {
    email: 'admin@vonana.co.mz',
    username: 'admin',
    fullName: 'Administrador VONANA',
    displayName: 'Admin',
    bio: 'Conta de administração da plataforma VONANA.',
    province: 'MAPUTO_CIDADE',
    city: 'Maputo',
    role: 'SUPER_ADMIN',
    password: 'Admin123!',
  },
  {
    email: 'ana.cumbe@example.mz',
    username: 'ana_cumbe',
    fullName: 'Ana Cumbe',
    displayName: 'Ana Cumbe',
    bio: 'Designer e empreendedora de capulanas em Inhambane.',
    province: 'INHAMBANE',
    city: 'Inhambane',
    password: 'Teste1234',
  },
  {
    email: 'joao.mateus@example.mz',
    username: 'joao_mateus',
    fullName: 'João Mateus',
    displayName: 'João M.',
    bio: 'Programador em Maputo. Café e open source.',
    province: 'MAPUTO_CIDADE',
    city: 'Maputo',
    password: 'Teste1234',
  },
  {
    email: 'fatima.nuro@example.mz',
    username: 'fatima_nuro',
    fullName: 'Fátima Nuro',
    displayName: 'Fátima',
    bio: 'Fotógrafa e contadora de histórias de Nampula.',
    province: 'NAMPULA',
    city: 'Nampula',
    password: 'Teste1234',
  },
  {
    email: 'carlos.beira@example.mz',
    username: 'carlos_beira',
    fullName: 'Carlos Domingos',
    displayName: 'Carlos Beira',
    bio: 'Empreendedor em Sofala. Mercado e comunidade.',
    province: 'SOFALA',
    city: 'Beira',
    password: 'Teste1234',
  },
];

async function upsertUser(data: SeedUser) {
  const passwordHash = await bcrypt.hash(data.password, 12);
  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      fullName: data.fullName,
      displayName: data.displayName,
      bio: data.bio,
      province: data.province,
      city: data.city,
      role: data.role ?? 'USER',
      accountStatus: 'ACTIVE',
      passwordHash,
    },
    create: {
      email: data.email,
      username: data.username,
      fullName: data.fullName,
      displayName: data.displayName,
      bio: data.bio,
      province: data.province,
      city: data.city,
      role: data.role ?? 'USER',
      accountStatus: 'ACTIVE',
      emailVerified: new Date(),
      passwordHash,
    },
  });
}

async function main() {
  const created = [];
  for (const u of users) {
    created.push(await upsertUser(u));
  }

  const byUsername = Object.fromEntries(created.map((u) => [u.username, u]));

  // Follow graph
  const followPairs: [string, string][] = [
    ['joao_mateus', 'ana_cumbe'],
    ['joao_mateus', 'fatima_nuro'],
    ['ana_cumbe', 'joao_mateus'],
    ['ana_cumbe', 'carlos_beira'],
    ['fatima_nuro', 'ana_cumbe'],
    ['carlos_beira', 'joao_mateus'],
    ['admin', 'ana_cumbe'],
    ['admin', 'joao_mateus'],
  ];

  for (const [follower, following] of followPairs) {
    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: byUsername[follower].id,
          followingId: byUsername[following].id,
        },
      },
      create: {
        followerId: byUsername[follower].id,
        followingId: byUsername[following].id,
      },
      update: {},
    });
  }

  // Clear prior seed posts for these authors (idempotent-ish re-seed of content)
  await prisma.post.deleteMany({
    where: { authorId: { in: created.map((u) => u.id) } },
  });

  const postDefs: {
    author: string;
    content: string;
    visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  }[] = [
    {
      author: 'ana_cumbe',
      content:
        'Acabei de lançar a minha nova colecção de capulanas com padrões inspirados em Inhambane. Em breve no marketplace da VONANA 🧡',
      visibility: 'PUBLIC',
    },
    {
      author: 'joao_mateus',
      content:
        'Hoje realizámos o primeiro encontro de programadores em Maputo! Já estamos a planear o próximo evento em Beira.',
      visibility: 'PUBLIC',
    },
    {
      author: 'fatima_nuro',
      content:
        'Nascer do sol na Ilha de Moçambique. Há histórias em cada parede.',
      visibility: 'PUBLIC',
    },
    {
      author: 'carlos_beira',
      content:
        'Mercado do Goto a ferver esta manhã. Quem precisa de fornecedores de castanha de caju?',
      visibility: 'FOLLOWERS',
    },
    {
      author: 'joao_mateus',
      content: 'Nota privada: ideias para o próximo meetup (só eu).',
      visibility: 'PRIVATE',
    },
    {
      author: 'admin',
      content:
        'Bem-vindos à VONANA! Pessoas. Comunidades. Negócios. Construímos isto para Moçambique 🇲🇿',
      visibility: 'PUBLIC',
    },
  ];

  const posts = [];
  for (const def of postDefs) {
    const author = byUsername[def.author];
    posts.push(
      await prisma.post.create({
        data: {
          authorId: author.id,
          ownerType: 'USER',
          ownerId: author.id,
          content: def.content,
          visibility: def.visibility,
        },
      }),
    );
  }

  const publicAna = posts[0];
  const publicJoao = posts[1];

  await prisma.reaction.createMany({
    data: [
      { postId: publicAna.id, userId: byUsername.joao_mateus.id, type: 'LIKE' },
      { postId: publicAna.id, userId: byUsername.fatima_nuro.id, type: 'LOVE' },
      { postId: publicJoao.id, userId: byUsername.ana_cumbe.id, type: 'LIKE' },
      { postId: publicJoao.id, userId: byUsername.carlos_beira.id, type: 'CELEBRATE' },
    ],
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: [
      {
        postId: publicAna.id,
        authorId: byUsername.joao_mateus.id,
        content: 'Parabéns Ana! As cores estão incríveis.',
      },
      {
        postId: publicJoao.id,
        authorId: byUsername.ana_cumbe.id,
        content: 'Excelente iniciativa — conte comigo no próximo!',
      },
    ],
  });

  // Sample notifications for Ana
  await prisma.notification.createMany({
    data: [
      {
        recipientId: byUsername.ana_cumbe.id,
        actorId: byUsername.joao_mateus.id,
        type: 'NEW_FOLLOWER',
        entityType: 'user',
        entityId: byUsername.joao_mateus.id,
      },
      {
        recipientId: byUsername.ana_cumbe.id,
        actorId: byUsername.joao_mateus.id,
        type: 'POST_REACTION',
        entityType: 'post',
        entityId: publicAna.id,
      },
      {
        recipientId: byUsername.ana_cumbe.id,
        actorId: byUsername.joao_mateus.id,
        type: 'POST_COMMENT',
        entityType: 'post',
        entityId: publicAna.id,
      },
    ],
  });

  console.log('Seed VONANA M2 concluído.');
  console.log('Contas de teste:');
  for (const u of users) {
    console.log(`  ${u.email} / ${u.username} / ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
