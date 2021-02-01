import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ChatService} from "./chat.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";
import {EChatType} from "./enums/chatType.enum";
import {User} from "../user.decorator";

@ApiTags('Chats')
@Controller()
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat')
    find(@Req() req, @Query('userId') userId: string) {
        return this.chatService.getChatBetweenUsers(req.user._id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat/list')
    findListChatByUser(@User() user) {
        const userId = user._id
        return this.chatService.getChatListByUser(userId)

    }

    @UseGuards(JwtAuthGuard)
    @Post('chat/create')
    createNewChat(@User() user, @Body() body: any) {
        return this.chatService.createNewChatRoom({
            owner: user._id,
            type: EChatType.chat,
            connectedUsers: body.userId
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get('chat/messagesList')
    getListMessagesByChatId(@Param()chatRoom: any, @Query('chatRoomId') chatRoomId: string) {
        console.log('get message list', chatRoomId, chatRoom)
        return this.chatService.getAllMessages(chatRoomId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('chatRoom/create')
    async createNewChatRoom(@User() user, @Body() body: any) {
        let {name, connectedUsers, type} = body;
        const newChanel = await this.chatService.createNewChatRoom({
            owner: user._id,
            name: name,
            type: type,
            connectedUsers
        })
        console.log(newChanel)
        return newChanel
    }


}
