import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Main');
  app.setGlobalPrefix('api/waitlist-microservice');

  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.get<string>('nats.server')],
      queue: 'waitlist-rest-service',
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const config = new DocumentBuilder()
    .setTitle('Waitlist Microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/waitlist-microservice/docs', app, document, {
    jsonDocumentUrl: '/api/waitlist-microservice/docs/swagger.json',
    swaggerOptions: {
      url: '/api/waitlist-microservice/docs/swagger.json',
      displayRequestDuration: true,
    },
  });

  app.enableCors({ origin: '*' });
  const port = configService.get<number>('port');
  await app.startAllMicroservices();
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap().catch((err) => console.error(err));
