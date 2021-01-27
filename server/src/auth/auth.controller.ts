import {Body, Controller, Post, Res} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {CreateUserDto} from "../user/dto/create.user.dto";
import {ApiBody, ApiTags} from "@nestjs/swagger";
import {LoginUserDto} from "../user/dto/login.user.dto";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @ApiBody({type: [CreateUserDto]})
    @Post('register')
    async register(@Body() createUser: CreateUserDto, @Res() res) {
        console.log('register ', createUser)
        return this.authService.register(createUser)
    }

    @Post('login')
    async login(@Body() loginUser: LoginUserDto){
        return this.authService.login(loginUser)
    }
}
