import { Module } from '@nestjs/common';
import { GameModule } from 'network/game.module';
import { AppController } from './app.controller';

@Module({
  imports: [GameModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
