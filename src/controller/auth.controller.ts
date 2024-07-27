import { Controller, Post, Body } from '@midwayjs/decorator';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/login')
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto);
    }

    @Post('/register')
    async register(@Body() registerDto: { email: string; password: string }) {
        return this.authService.register(registerDto);
    }
}