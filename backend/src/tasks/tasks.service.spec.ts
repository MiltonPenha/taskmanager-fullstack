import { NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const prisma = {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(prisma as never);
  });

  it('lists only tasks from the authenticated user with filters', async () => {
    prisma.task.findMany.mockResolvedValue([]);

    await service.findAll('user-id', {
      status: TaskStatus.PENDING,
      search: 'estudar',
    });

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user-id',
        status: TaskStatus.PENDING,
        title: {
          contains: 'estudar',
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  it('creates a task linked to the authenticated user', async () => {
    prisma.task.create.mockResolvedValue({
      id: 'task-id',
      title: 'Estudar',
      description: 'Revisar NestJS',
      status: TaskStatus.PENDING,
      userId: 'user-id',
    });

    await service.create('user-id', {
      title: 'Estudar',
      description: 'Revisar NestJS',
    });

    expect(prisma.task.create).toHaveBeenCalledWith({
      data: {
        title: 'Estudar',
        description: 'Revisar NestJS',
        userId: 'user-id',
      },
    });
  });

  it('does not update tasks from another user', async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(
      service.update('user-id', 'task-id', {
        title: 'Novo titulo',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.task.update).not.toHaveBeenCalled();
  });

  it('toggles task status', async () => {
    prisma.task.findFirst.mockResolvedValue({
      id: 'task-id',
      status: TaskStatus.PENDING,
      userId: 'user-id',
    });
    prisma.task.update.mockResolvedValue({
      id: 'task-id',
      status: TaskStatus.DONE,
      userId: 'user-id',
    });

    await service.toggleStatus('user-id', 'task-id');

    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 'task-id' },
      data: {
        status: TaskStatus.DONE,
      },
    });
  });
});

