import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotesModule } from './notes/notes.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    NotesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
