import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TypingDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly typing: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly chatRoom: string;
}
