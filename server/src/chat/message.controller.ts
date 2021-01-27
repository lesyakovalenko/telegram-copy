import { Controller, Get, Query } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Message} from "./interfaces/message.interface";

@Controller('messages')
export class MessagesController {
    constructor(@InjectModel('Message') private readonly model: Model<Message>) {}

    @Get()
    find(@Query('where') where) {
        where = JSON.parse(where || '{}');
        return this.model.find(where).populate('owner').exec();
    }
}