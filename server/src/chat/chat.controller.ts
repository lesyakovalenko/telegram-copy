import {Body, Controller, Get, Param, Post, Query, Req, UseGuards} from '@nestjs/common';
import {ApiTags} from "@nestjs/swagger";
import {ChatService} from "./chat.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";

@ApiTags('Chats')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {
    }

    // @Get()
    // find(@Query('q') q) {
    //     if (q) return this.model.find({name: {$regex: new RegExp(`.*${q}.*`)}});
    //     else return this.model.find();
    // }
    //
    // @Get('/:id')
    // findById(@Param('id') id: string) {
    //     return this.model.findById(id);
    // }
    //
    // @Post()
    // save(@Body() item: ChatRoom) {
    //     return item._id ? this.model.findByIdAndUpdate(item._id, item, {new: true}) : this.model.create(item);
    // }

    @UseGuards(JwtAuthGuard)
    @Get('')
    find(@Req() req, @Query('userId') userId: string) {
        return this.chatService.getChatBetweenUsers(req.user._id, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    findListChatByUser(@Req() req) {
        const userId = req.user._id
        return this.chatService.getChatListByUser(userId)

    }

    @UseGuards(JwtAuthGuard)
    @Post('create')
    createNewChat(@Req() req, @Body() body: any) {
        return this.chatService.createNewChat(req.user._id, body.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('messagesList')
    getListMessagesByChatId(@Param()chatRoom: any, @Query('chatRoomId') chatRoomId: string){
        console.log('get message list',chatRoomId, chatRoom)
        return this.chatService.getAllMessages(chatRoomId)
    }
}
