import {Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {UserService} from "./user.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";
import {ApiTags} from "@nestjs/swagger";
import {User} from "../user.decorator";
import {FileInterceptor} from "@nestjs/platform-express";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getUserInfo(@User() user) {
        return this.userService.findUserByEmail(user.email)
    }

    @UseGuards(JwtAuthGuard)
    @Get('list')
    getListUsers(@Req() req) {
        return this.userService.findUsersList();
    }

    @UseGuards(JwtAuthGuard)
    @Get('listExId')
    getListUsersExId(@User() user) {
        return this.userService.findUsersListExId(user._id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('joinChatList')
    getUserWithJoinChatList(@User() user) {
        return this.userService.findUserByEmail(user.email)
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('uploadAvatar')
    uploadAvatar(@User() user, @UploadedFile() file){
        console.log('avatar', file)
        return this.userService.updateAvatar(file, user._id)
    }
}
