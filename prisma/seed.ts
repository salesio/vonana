/**
 * Creates the first admin account for local development.
 * Run with: npm run seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@vonana.co.mz';
  const username = 'admin';
  const password = 'Admin123!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin já existe, nada a fazer.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      fullName: 'Administrador VONANA',
      displayName: 'Admin',
      role: 'SUPER_ADMIN',
      accountStatus: 'ACTIVE',
      emailVerified: new Date(),
    },
  });

  console.log('Conta de administrador criada:');
  console.log(`  Email:    ${email}`);
  console.log(`  Username: ${username}`);
  console.log(`  Password: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
