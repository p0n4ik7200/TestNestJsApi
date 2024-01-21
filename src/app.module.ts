import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([TodoEntity, UserEntity]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'my_user',
      password: 'my_password',
      database: 'my_database',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: '4b2e7526-42dc-40c5-9fa3-a7bcd2d3b23c',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TodosController, UsersController, AuthController],
})
export class AppModule {}
