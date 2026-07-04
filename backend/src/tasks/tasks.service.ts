import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, TaskStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string, query: TaskQueryDto) {
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            title: {
              contains: query.search,
              mode: "insensitive"
            }
          }
        : {})
    };

    return this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        status: dto.status ?? TaskStatus.pending,
        userId
      }
    });
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.ensureTaskBelongsToUser(userId, id);

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description.trim() }
          : {}),
        ...(dto.status !== undefined ? { status: dto.status } : {})
      }
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureTaskBelongsToUser(userId, id);
    await this.prisma.task.delete({
      where: { id }
    });

    return { message: "Tarefa removida com sucesso." };
  }

  private async ensureTaskBelongsToUser(userId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        userId
      }
    });

    if (!task) {
      throw new NotFoundException("Tarefa nao encontrada.");
    }

    return task;
  }
}

