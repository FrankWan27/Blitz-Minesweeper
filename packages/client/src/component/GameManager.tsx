import { io } from "socket.io-client";
import socketManager from "./websocket/SocketManager";

const socket = io();
const sm = socketManager;
export default function GameManager() {
    
    return (<></>);
}