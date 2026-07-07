import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from '../auth/types/authenticated-request.type';
import { CreateTaskDto } from './dto/create-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll(@Req() request: AuthenticatedRequest, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(request.user.id, query);
  }

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(request.user.id, createTaskDto);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(request.user.id, id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.remove(request.user.id, id);
  }

  @Patch(':id/toggle')
  toggleStatus(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.tasksService.toggleStatus(request.user.id, id);
  }
}

