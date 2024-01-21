import {
  Controller,
  Post,
  Body,
  ConflictException,
  Injectable,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserModel } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@Injectable()
export class UsersController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Register as a user' })
  @ApiResponse({ status: HttpStatus.ACCEPTED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User already exists',
  })
  async createUser(@Body() user: UserModel): Promise<void> {
    const existingUser = await this.userRepository.findOne({
      where: { name: user.name },
    });

    if (existingUser) {
      throw new ConflictException(
        `User with same name '${user.name}' already exists`,
      );
    }

    const passwordHash = await bcrypt.hash(user.password, 10);

    const creationUser: UserEntity = {
      id: user.id,
      name: user.name,
      passwordHash: passwordHash,
      isAdmin: false,
      todos: [],
    };

    await this.userRepository.insert(creationUser);
  }
}
