import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //makes this module globally available across the application-no need to import in other modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //exporting PrismaService so it can be injected into other modules
})
export class PrismaModule {}
