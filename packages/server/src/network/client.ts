import { Socket } from "socket.io";
import { Lobby } from "./lobby";

export class Client extends Socket {
  name: string;
  lobby: null | Lobby;
}