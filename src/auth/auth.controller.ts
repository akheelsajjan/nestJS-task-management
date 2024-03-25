/* eslint-disable prettier/prettier */
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    @Post('/signup')
    signUp(@Body() authCredentialDto: AuthCredentialDto):Promise<void>{
        return this.authService.createUser(authCredentialDto);
    }

    @Post('/signIn')
    signIn(@Body() authCredentialDto: AuthCredentialDto):Promise<{accessToken}>{
        return this.authService.signIn(authCredentialDto);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@Req() req){
        console.log(req)
    }
    
    
}
