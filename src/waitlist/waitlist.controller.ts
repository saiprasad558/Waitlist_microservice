import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { WaitlistService } from './waitlist.service';
import { CreateWaitListDto } from './dto/create-waitlist.dto';

@ApiBearerAuth()
@ApiTags('waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistSerivce: WaitlistService) {}

  @Post()
  create(@Body() createWaitListDto: CreateWaitListDto) {
    return this.waitlistSerivce.create(createWaitListDto);
  }

  @ApiQuery({ name: 'patientId', required: false })
  @ApiQuery({ name: 'doctorId', required: false })
  @Get()
  findAll(
    @Query('patientId') patientId?: string,
    @Query('doctorId') doctorId?: string,
  ) {
    return this.waitlistSerivce.findAll(patientId, doctorId);
  }
}
