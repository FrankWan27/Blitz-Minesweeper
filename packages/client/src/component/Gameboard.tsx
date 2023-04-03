import { Button } from "@mantine/core";
import React from "react";
import { TileState } from "shared/Payloads";

class Tile extends React.Component {
    render() {
        return (<Button>💣</Button>)
    }
}

export default class Gameboard extends React.Component {

    constructor(props) {
        super(props);
    }
    
    render() {
        if (!board) {
            const sm = socketManager;

        }
        return (<Tile/>);
      }
}




