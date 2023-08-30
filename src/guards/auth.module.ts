import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
