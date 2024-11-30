import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessErrorsInterceptor } from './shared/interceptors/business-errors/business-errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });
  app.useGlobalInterceptors(new BusinessErrorsInterceptor());
  await app.listen(3000);
}
bootstrap();
