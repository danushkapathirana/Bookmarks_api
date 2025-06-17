import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    // super calls the constructor of parent class (constructor of PrismaClient in this case)
    super({
      datasources: {
        db: {
          url: 'postgresql://postgres:123@localhost:5434/bookmark_api?schema=public',
        },
      },
    });
  }
}
