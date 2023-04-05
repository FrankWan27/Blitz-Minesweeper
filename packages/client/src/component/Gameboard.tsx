import { Button } from "@mantine/core";
import React from "react";
import { TileState } from "shared/Payloads";
import './Gameboard.css';

const Tile: React.FC<{state: TileState}> = (props) => {
    const getText = () => {
        switch (props.state) {
            case 'bomb':
              return '💣';
            case 'flag':
              return '🚩';
            case 'hidden':
            case 'blank':
              return ' ';
            default:
              return props.state;
        }
    }

    return (
    <td><div className='btn' style={{width: '30px', height: '30px'}}>{getText()}</div></td>
    )
    
}

interface Props {
    board: TileState[][],
    width : number, 
    height : number
}

export const Gameboard: React.FC<Props> = (props) => {
    const grid = [];
    console.log(props);
    
    for (let y = 0; y < props.height; y++) {
        const row = [];
        for (let x = 0; x < props.width; x++) {
            row.push(<Tile state={props.board[x][y]}key={'${x}-${y}'} />);
        }
        grid.push(<tr key={y}>{row}</tr>);
    }

    return <table>{grid}</table>;
}

export default Gameboard;
