import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string, query: QueryTasksDto) {
    return this.prisma.task.findMany({
      where: {
        userId,
        status: query.status,
        title: query.search
          ? {
              contains: query.search,
              mode: 'insensitive',
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  create(userId: string, createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        userId,
      },
    });
  }

  async update(userId: string, id: string, updateTaskDto: UpdateTaskDto) {
    await this.findOwnedTask(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOwnedTask(userId, id);

    await this.prisma.task.delete({
      where: { id },
    });

    return { message: 'Task deleted successfully' };
  }

  async toggleStatus(userId: string, id: string) {
    const task = await this.findOwnedTask(userId, id);
    const nextStatus = task.status === TaskStatus.PENDING ? TaskStatus.DONE : TaskStatus.PENDING;

    return this.prisma.task.update({
      where: { id },
      data: {
        status: nextStatus,
      },
    });
  }

  private async findOwnedTask(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}

