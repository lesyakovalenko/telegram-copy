import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from "@nestjs/passport";
import {JwtStrategy} from "./jwt.strategy";

@Module({
  imports: [
      UserModule,
      PassportModule,
      JwtModule.register({
        secret: process.env.JWT_SECRET
      })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
    exports: [JwtModule]
})
export class AuthModule {}
