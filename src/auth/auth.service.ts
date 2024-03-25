/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import * as  bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService:JwtService
    ){}

    async createUser(authCredentialsDto:AuthCredentialDto):Promise<void>{
        console.log('-------create user-------')
        const { userName, password } = authCredentialsDto;

        const salt = await bcrypt.genSalt();
        const hasPassword = await bcrypt.hash(password, salt);

        const user = this.userRepository.create({
            userName,
            password: hasPassword
        });

        try{
            await this.userRepository.save(user);
        }catch(error){
            if(error.code === '23505'){
                throw new ConflictException('User Name Already Exists');
            }else{
                throw new InternalServerErrorException();
            }
        }
       
    }

    async signIn(authCredentialsDto:AuthCredentialDto):Promise<{accessToken}>{
        const { userName, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({
            where:{
                userName
            }
        })

        if(user && (await bcrypt.compare(password, user.password))){
            const payload : JwtPayload = { userName}
            const accessToken = await this.jwtService.sign(payload)
            return {accessToken}
        }else{
            throw new UnauthorizedException('Please check you password')
        }
    }
}
