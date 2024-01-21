import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  HttpCode,
  HttpStatus,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { TodoCreationModel } from './todo-creation.model';
import { TodoUpdatingModel } from './todo-updating.model';
import { TodoEntity } from './todo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { UserEntity } from './user.entity';

@ApiTags('Todos')
@ApiBearerAuth()
@Controller('todos')
export class TodosController {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a list of all todos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getAllTodos(): Promise<TodoEntity[]> {
    return await this.todoRepository.find();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get todo' })
  @ApiParam({ name: 'id', required: true, description: 'Todo identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Todo not found' })
  async getTodoById(@Param('id') id: string): Promise<TodoEntity> {
    const existingTodo = await this.todoRepository.findOne({ where: { id } });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with id '${id}' not found`);
    }

    return existingTodo;
  }

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Create todo' })
  @ApiParam({
    name: 'todo',
    required: true,
    description: 'Todo creation model',
  })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Todo already exists',
  })
  async createTodo(
    @Req() request,
    @Body() todo: TodoCreationModel,
  ): Promise<void> {
    const userId = request['user'].sub;

    const existingTodo = await this.todoRepository.findOne({
      where: { id: todo.id },
    });

    if (existingTodo) {
      throw new ConflictException(
        `Todo with same id '${todo.id}' already exists`,
      );
    }

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    const creationTodo: TodoEntity = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isDone: todo.isDone,
      user: existingUser,
    };

    await this.todoRepository.insert(creationTodo);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Change todo' })
  @ApiParam({
    name: 'todo',
    required: true,
    description: 'Todo updating model',
  })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'FORBIDDEN',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found',
  })
  async updateTodo(
    @Req() request,
    @Param('id') id: string,
    @Body() todo: TodoUpdatingModel,
  ): Promise<void> {
    const existingTodo = await this.todoRepository.findOne({
      where: { id: id },
    });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with id '${id}' not found`);
    }

    const isAdmin = request['user'].isAdmin;
    const userId = request['user'].sub;

    if (isAdmin == false) {
      const isMyTodo = await this.todoRepository
        .createQueryBuilder('ToDo')
        .where('ToDo.id = :id', { id })
        .andWhere('ToDo.user = :userId', { userId })
        .getExists();

      if (isMyTodo == false) {
        throw new ForbiddenException();
      }
    }

    const updatingTodo: TodoEntity = {
      id: id,
      title: todo.title,
      description: todo.description,
      isDone: todo.isDone,
      user: null,
    };

    await this.todoRepository.update(id, updatingTodo);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete todo' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Todo identifier',
  })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'FORBIDDEN',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Todo not found',
  })
  async deleteTodo(@Req() request, @Param('id') id: string): Promise<void> {
    const existingTodo = await this.todoRepository.findOne({
      where: { id: id },
    });

    if (!existingTodo) {
      throw new NotFoundException(`Todo with id '${id}' not found`);
    }

    const isAdmin = request['user'].isAdmin;
    const userId = request['user'].sub;

    if (isAdmin == false) {
      const isMyTodo = await this.todoRepository
        .createQueryBuilder('ToDo')
        .where('ToDo.id = :id', { id })
        .andWhere('ToDo.user = :userId', { userId })
        .getExists();

      if (isMyTodo == false) {
        throw new ForbiddenException();
      }
    }

    await this.todoRepository.delete(id);
  }
}
