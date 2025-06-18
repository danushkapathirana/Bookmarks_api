import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

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
      return user;
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

  signin() {
    return { message: 'signin' };
  }
}
