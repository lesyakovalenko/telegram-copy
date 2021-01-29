import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserInfo(@Req() req) {
        return this.userService.findUserByEmail(req.user.email)
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    getListUsers(@Req() req) {
        return this.userService.findUsersList();
    }

    @UseGuards(JwtAuthGuard)
    @Get('listExId')
    getListUsersExId(@Req() req) {
        return this.userService.findUsersListExId(req.user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('joinChatList')
    getUserWithJoinChatList(@Req() req) {
        return this.userService.findUserByEmail(req.user.email)
    }
}
