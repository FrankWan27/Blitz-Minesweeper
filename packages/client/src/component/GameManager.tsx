import { io } from "socket.io-client";
import SocketManager from "./websocket/SocketManager";

const socket = io();

export default function GameManager() {
    console.log(socket);
    socket.emit('client.ping', {message: "ping"});
    socket.on('server.pong', () => {
        console.log("hello");
    })
    return (<></>);
}