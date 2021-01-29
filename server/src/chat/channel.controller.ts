import {Body, Controller, Get, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ChatService} from "./chat.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";

@ApiTags('Chats')
@Controller('channel')
export class ChannelController {
    constructor(private readonly chatService: ChatService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    find(@Req() req, @Query('userId') userId: string) {
        //return this.chatService.ge(req.user._id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    findListChatByUser() {
       // return this.chatService.getChatListByUser()

    }
    @UseGuards(JwtAuthGuard)
    @Post('create')
    createNewChat(@Req() req, @Body() body: any) {
        return this.chatService.createNewChat(req.user._id, body.userId);
    }
}
