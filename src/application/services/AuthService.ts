import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../repositories/UserRepository';
import { TokenRepository } from '../../repositories/TokenRepository';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private users = new UserRepository();
  private tokens = new TokenRepository();

  async validateUser(username: string, password: string) {
    const user = await this.users.findByUsername(username);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    // remove password before returning
    delete user.password;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user._id, username: user.username };
    const secret = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: '2h' });
    return { access_token: token };
  }

  async logout(token: string) {
    try {
      const decoded = jwt.decode(token) as any;
      let exp = decoded && decoded.exp ? decoded.exp : null;
      const expiresAt = exp ? new Date(exp * 1000) : new Date(Date.now() + 1000 * 60 * 60 * 2);
      await this.tokens.revoke(token, expiresAt);
      return true;
    } catch (e) {
      return false;
    }
  }
}
