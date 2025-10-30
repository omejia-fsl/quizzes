import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);

  logger.log(`Application loaded successfully`);
  logger.log(`Server listening on port ${port}`);
  logger.log(`Access API at: http://localhost:${port}`);
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
