import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenRepository } from '../repositories/TokenRepository';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private tokens = new TokenRepository();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('Missing Bearer token');
    const token = auth.substring(7);

    // deny if token is revoked
    const revoked = await this.tokens.isRevoked(token);
    if (revoked) throw new UnauthorizedException('Token revoked');

    try {
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, secret) as any;
      req.user = { id: decoded.sub, username: decoded.username };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
