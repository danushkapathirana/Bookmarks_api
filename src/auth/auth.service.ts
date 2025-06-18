import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: AuthDto) {
    // generate hash
    const hash = await argon.hash(dto.password);

    try {
      // save user in the database
      const user = await this.prismaService.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        // return only selected properties
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      });
      // return user;
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // P2002, unique constraint failed error code (in this case it checks the email is unique)
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists.');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect.');

    const passwordMatch = await argon.verify(user.hash, dto.password);

    if (!passwordMatch) throw new ForbiddenException('Credentials incorrect.');

    // return user data without hash
    const { hash, ...userData } = user;
    // return userData;
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email: email,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '15m',
    });

    return { access_token: token };
  }
}

/**
 * Note
 *
 * private config: ConfigService, why is not used "private" sometimes?
 *
 * private config: ConfigService ->
 * - declaring a class property named "config" (following code)
 * - assigning it the injected instance of "ConfigService"
 *
 * config: ConfigService ->
 * - "config" is just a local parameter - it is not stored as a class property
 * - only used inside the constructor
 */

// private config: ConfigService;

// constructor(config: ConfigService) {
//   this.config = config;
// }
