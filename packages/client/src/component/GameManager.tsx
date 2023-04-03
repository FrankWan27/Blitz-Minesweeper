import { io } from "socket.io-client";
import socketManager from "./websocket/SocketManager";
import Gameboard from "./Gameboard";
import React from "react";
import JoinLobby from "./JoinLobby";
import { TileState } from "shared/Payloads";

const socket = io();
const sm = socketManager;
export default class GameManager extends React.Component {
    render() {

        this.state = {
            board: [];
        }
        return (
            <div className="game">
                <JoinLobby/>
                <Gameboard board={this.state.board}/>
            </div>
        );
    }
}