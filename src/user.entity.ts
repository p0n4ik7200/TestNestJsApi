import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TodoEntity } from './todo.entity';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column()
  isAdmin: boolean;

  @OneToMany(() => TodoEntity, (todo) => todo.user)
  todos: TodoEntity[];
}
