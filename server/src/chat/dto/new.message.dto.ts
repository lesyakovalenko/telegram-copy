import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class NewMessageDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly author: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly text: string;


    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly chatRoom: string;
}
