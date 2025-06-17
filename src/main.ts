import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

/**
 * CMD
 *
 * nest g resource <RESOURCE_NAME> --no-spec
 * nest g module <MODULE_NAME>
 * nest g controller <CONTROLLER_NAME> --no-spec
 * nest g service <SERVICE_NAME> --no-spec
 */
