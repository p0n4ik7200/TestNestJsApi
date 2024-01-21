import { ApiProperty } from '@nestjs/swagger';

export class AuthModel {
  @ApiProperty({ description: 'User name', nullable: false })
  username: string;

  @ApiProperty({ description: 'User password', nullable: false })
  password: string;
}
