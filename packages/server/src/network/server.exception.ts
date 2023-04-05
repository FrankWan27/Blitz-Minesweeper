import { WsException } from '@nestjs/websockets';
import { Payloads } from '@shared/Payloads';
import { ServerEvents } from '@shared/Events';
import { Client } from './client';

export class ServerException extends WsException {
  constructor(message: string) {
    const exception: Payloads.ServerException = {
      message: message,
    };
    super(exception);
  }
}