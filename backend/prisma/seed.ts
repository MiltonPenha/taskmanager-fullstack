import { PrismaClient, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.upsert({
    where: {
      email: 'test@example.com',
    },
    update: {
      name: 'Test User',
      password,
    },
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password,
      tasks: {
        create: [
          {
            title: 'Estudar NestJS',
            description: 'Revisar modulos, guards e services.',
            status: TaskStatus.PENDING,
          },
          {
            title: 'Preparar apresentacao',
            description: 'Explicar arquitetura fullstack do projeto.',
            status: TaskStatus.DONE,
          },
        ],
      },
    },
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });

