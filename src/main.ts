import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applies a global pipe to every request in app
  app.useGlobalPipes(
    // check that incoming data matches the structure and rules defined in DTOs
    new ValidationPipe({
      // remove extra / unexpected properties that are not defined in DTOs
      whitelist: true,
    }),
  );
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
 *
 * docker compose up dev-db -d
 *
 * npx prisma init --datasource-provider postgresql --output ../generated/prisma
 * npx prisma migrate dev (this cmd automatically execute 'npx prisma generate')
 * npx prisma studio
 *
 *
 * Libraries
 *
 * npm install prisma --save-dev
 * npm install @prisma/client
 * npm i --save class-validator class-transformer
 * npm i argon2
 * npm i --save @nestjs/config
 *
 *
 * Custom scripts
 *
 * "prisma:dev:deploy": "prisma migrate deploy"
 * "db:dev:rm": "docker compose rm dev-db -s -f -v"
 *
 * -s -> stop the container before removing
 * -f -> force without removal confirmation
 * -v -> remove volume associated with container
 *
 * "db:dev:up": "docker compose up dev-db -d"
 *
 *
 * Note
 *
 * "npx prisma migrate dev" vs "npx prisma migrate deploy"
 *
 * npx prisma migrate dev ->
 * - creates a new migration file, if schema has changed
 * - applies the migration to local development database
 * - generates prisma client if needed
 * - good for development environment
 *
 * npx prisma migrate deploy ->
 * - looks for existing migration files in the prisma/migrations folder
 * - applies all pending migrations to the target database
 * - does not create a new migration file
 * - does not automatically generate prisma client
 * - good for production environment (or CI/CD pipeline)
 */
