import { Module } from '@nestjs/common';
import { GameModule } from 'network/game.module';
import { AppController } from './app.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    GameModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'build'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
