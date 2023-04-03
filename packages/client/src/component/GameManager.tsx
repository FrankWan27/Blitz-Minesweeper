import { io } from "socket.io-client";
import socketManager from "./websocket/SocketManager";
import Gameboard from "./Gameboard";
import React from "react";

const socket = io();
const sm = socketManager;
export default class GameManager extends React.Component {
    state = {
    height: 8,
    width: 8,
    mines: 10
    };

    render() {
        const { height, width, mines } = this.state;

        return (
            <div className="game">
                <Gameboard/>
            </div>
        );
    }
}