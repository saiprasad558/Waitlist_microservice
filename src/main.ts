import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const microService = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.NATS,
    options: {
      servers: [configService.get<string>('nats.server')],
      queue: 'waitlist-rest-service',
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('waitlist Microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: '/docs/swagger.json',
    swaggerOptions: {
      url: '/docs/swagger.json',
      displayRequestDuration: true,
    },
  });

  app.use(morgan('tiny'));
  app.enableCors();

  const port = configService.get<number>('port');
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap().catch((err) => console.error(err));
