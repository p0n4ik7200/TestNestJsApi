import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { AuthModel } from './auth.model';
import * as bcrypt from 'bcrypt';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth')
@Controller('oauth')
@Injectable()
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  //АУТЕНТИФИКАЦИЯ

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Username or password is incorrect',
  })
  async authenticate(@Body() auth: AuthModel) {
    const existingUser = await this.userRepository.findOne({
      where: { name: auth.username },
    });

    if (!existingUser)
      throw new BadRequestException(`Username or password is incorrect`);

    const comparing = await bcrypt.compare(
      auth.password,
      existingUser.passwordHash,
    );

    if (!comparing)
      throw new BadRequestException(`Username or password is incorrect`);

    const payload = {
      sub: existingUser.id,
      username: existingUser.name,
      isAdmin: existingUser.isAdmin,
    };

    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }
}
