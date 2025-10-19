import { Controller, Post, Body, UnauthorizedException, Req } from '@nestjs/common';
import { AuthService } from '../../application/services/AuthService';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.auth.validateUser(body.username, body.password);
    if (!user) throw new UnauthorizedException();
    return this.auth.login(user);
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    const auth = req.headers['authorization'];
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException();
    const token = auth.substring(7);
    const ok = await this.auth.logout(token);
    if (!ok) throw new UnauthorizedException();
    return { loggedOut: true };
  }
}
