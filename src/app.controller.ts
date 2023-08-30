import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { IsPublic } from '@sriram-nyshadham/shared';

@ApiExcludeController()
@Controller()
export class AppController {
  @IsPublic()
  @Get()
  getHello(): string {
    return 'Device Management Microservice is running!';
  }
}
