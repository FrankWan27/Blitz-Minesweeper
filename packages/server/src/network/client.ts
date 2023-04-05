import { Socket } from "socket.io";
import { Lobby } from "./lobby";

// export type Client = Socket & {
//     name: string;
//     lobby: null | Lobby;
// }

export class Client extends Socket {
  name: string;
  lobby: null | Lobby;
}

export type ClientId = string;