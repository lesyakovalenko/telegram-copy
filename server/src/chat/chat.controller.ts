import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ChatRoom} from "./interfaces/chatRoom.interfaces";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";

@Controller('chat')
export class ChatController {
    constructor(@InjectModel('ChatRoom') private readonly model: Model<ChatRoom>) {}

    @Get()
    find(@Query('q') q) {
        if (q) return this.model.find({name: {$regex: new RegExp(`.*${q}.*`)}});
        else return this.model.find();
    }

    @Get('/:id')
    findById(@Param('id') id: string) {
        return this.model.findById(id);
    }

    @Post()
    save(@Body() item: ChatRoom) {
        return item._id ? this.model.findByIdAndUpdate(item._id, item, {new: true}) : this.model.create(item);
    }
}
