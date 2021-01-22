import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {UserService} from "./user.service";
import JwtAuthGuard from "../auth/JwtAuthGuard";
import {ApiTags} from "@nestjs/swagger";

@ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){

    }
    @UseGuards(JwtAuthGuard)
    @Get('get')
    getUserInfo(@Req() req){
        console.log(req)
        return this.userService.findUserByEmail(req.user.email)
    }
}
