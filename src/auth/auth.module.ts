/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtStratergy } from './jwt.stratergy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:async (configService:ConfigService)=>{
        return {
            secret:configService.get('DB_JWT'),
              signOptions:{
              expiresIn:3600
            }
        }
      }
    }),
    TypeOrmModule.forFeature([User])
  ],
  providers: [AuthService,jwtStratergy],
  controllers: [AuthController],
  exports:[jwtStratergy, PassportModule]
})
export class AuthModule {}
