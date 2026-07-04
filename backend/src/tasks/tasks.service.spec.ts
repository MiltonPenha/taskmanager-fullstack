import { NotFoundException } from "@nestjs/common";
import { TaskStatus } from "@prisma/client";
import { TasksService } from "./tasks.service";

describe("TasksService", () => {
  const prisma = {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    }
  };

  let service: TasksService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TasksService(prisma as never);
  });

  it("filters tasks by authenticated user", async () => {
    prisma.task.findMany.mockResolvedValue([]);

    await service.findAll("user-1", {
      status: TaskStatus.pending,
      search: "api"
    });

    expect(prisma.task.findMany).toHaveBeenCalledWith({
      where: {
        userId: "user-1",
        status: TaskStatus.pending,
        title: {
          contains: "api",
          mode: "insensitive"
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  });

  it("does not update tasks from another user", async () => {
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(
      service.update("user-1", "task-1", { status: TaskStatus.done })
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

