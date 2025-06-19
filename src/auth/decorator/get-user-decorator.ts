import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);

/**
 * Note
 *
 * data: keyof User, ctx: ExecutionContext ->
 * - data is the optional string key which might pass to the decorator (ex: email)
 * - ctx is the NestJS execution context, which extract the HTTP request
 *
 * const request = ctx.switchToHttp().getRequest(); ->
 * - this converts the "ExecutionContext" into an Express HTTP context and gets the request object
 *
 * const user = request.user; ->
 * - this gets the user object that was populated by the AuthGuard('jwt')
 */
