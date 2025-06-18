import { Body, Controller, ParseIntPipe, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin();
  }

  // it is not recommended to use request object of underlying library (ex: express)
  // @Post('signin')
  // signin(@Req() request: Request) {
  //   console.log(request);
  // }

  // pipes are just a function that transform / validate the data
  // @Post('signin')
  // signin(
  //   @Body('email') email: string,
  //   @Body('password', ParseIntPipe) password: string,
  // ) {
  //   console.log({ email, password });
  // }
}
