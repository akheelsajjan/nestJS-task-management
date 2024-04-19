/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { JwtPayload } from "./jwt-payload.interface";
//import { ConfigService } from "@nestjs/config";

@Injectable()
export class jwtStratergy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
       // private configService:ConfigService
    ){
        super({
            secretOrKey:'top', //configService.get('DB_JWT'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload:JwtPayload):Promise<User>{
        const { userName } = payload;
        const user = await this.userRepository.findOne({
            where:{
                userName
            }
        });

        if(!user){
            throw new UnauthorizedException();
        }

        return user
    }
}