import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private prismaService: PrismaService,
  ) {
    super({
      // this tells Passport how to find the JWT in incoming request
      // here, it extracts the token from the "Authorization: Bearer <token>" header
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')!,
    });
  }

  // this method is called after JWT is successfully decoded and verified
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const { hash, ...userData } = user;
    // whatever return, it is automatically set as request.user (return request.user)
    return userData;
  }
}

/**
 * Note
 *
 * JwtStrategy extends PassportStrategy(Strategy) ->
 *
 * - "PassportStrategy" is a NestJS wrapper that makes Passport strategies easier to use with NestJS's DIS
 * - "Strategy" is the actual JWT strategy from "passport-jwt"
 * - simply means, wrap JWT strategy from "passport-jwt" in a NestJS compatible way
 */
