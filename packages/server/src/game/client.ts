import { Socket } from "socket.io";
import { Lobby } from "./lobby";

export type Client = Socket & {
    name: string;
    lobby: null | Lobby;
    
    function getId() : ClientId {
        return this["id"];
    }
}

export type ClientId = string;