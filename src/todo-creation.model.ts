import { ApiProperty } from '@nestjs/swagger';

export class TodoCreationModel {
  @ApiProperty({ description: 'Todo id', nullable: false })
  id: string;

  @ApiProperty({ description: 'Todo title', nullable: false })
  title: string;

  @ApiProperty({ description: 'Todo description', nullable: false })
  description: string;

  @ApiProperty({ description: 'Todo  done status', nullable: false })
  isDone: boolean;
}
