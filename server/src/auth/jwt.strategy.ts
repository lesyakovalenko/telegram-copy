import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {JwtPayloadDto} from "./dto/jwt.payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET
        });

    }

    async validate(payload: JwtPayloadDto, done){
        try {
            console.log(payload)
            done(null, payload)
        }catch (e){
            throw new UnauthorizedException(e)
        }
    }

}