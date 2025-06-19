import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard)
  @Get('me')
  // use same decorator to retrieve either full user object or specified field from it
  getUser(@GetUser() user: User, @GetUser('email') email: string) {
    return user;
  }
}

/**
 * Note
 *
 * @UseGuards(AuthGuard('jwt')) ->
 *
 * - whenever register a strategy using "PassportStrategy" usually in JwtStrategy,
 * it is a given name
 * - by default, it is registered as "jwt", unless it is specified with a custom name
 */
