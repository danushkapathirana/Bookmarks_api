import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('user')
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@Req() request: Request) {
    return request.user;
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
