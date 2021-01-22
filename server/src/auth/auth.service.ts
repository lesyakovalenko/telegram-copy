import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as bcrypt from "bcrypt";
import {JwtService} from '@nestjs/jwt';
import {CreateUserDto} from "../user/dto/create.user.dto";
import {UserService} from "../user/user.service";
import {LoginUserDto} from "../user/dto/login.user.dto";
import {User} from "../user/interfaces/user.interface";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {
    }

    async login(loginUser: LoginUserDto) {
        try {
            const {email, password} = loginUser;
            const user: User = await this.userService.findUserByEmail(email);
            const isPasswordMatching = bcrypt.compareSync(password, user.password);

            if (!isPasswordMatching) {
                throw 'Wrong password'
            }
            const token = this.jwtService.sign({_id: user._id, email: user.email}, {
                secret: process.env.JWT_SECRET
            })
            return {user, token}
        } catch (e) {
            throw new HttpException(e, HttpStatus.BAD_REQUEST);
        }
    }

    async register(userDto: CreateUserDto) {
        try {
            const createUser = await this.userService.create(userDto);
            return {...createUser}
        } catch (error) {
            if (error?.code === 11000) {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
