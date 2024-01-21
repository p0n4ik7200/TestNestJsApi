import { ApiProperty } from '@nestjs/swagger';

export class UserModel {
  @ApiProperty({ description: 'User identifier', nullable: false })
  id: string;

  @ApiProperty({ description: 'User name', nullable: false })
  name: string;

  @ApiProperty({ description: 'User password', nullable: false })
  password: string;
}
