import { Button } from "@mantine/core";
import React from "react";
import { TileState } from "shared/Payloads";

class Tile extends React.Component<{state: TileState}> {

    constructor(props: { state: TileState; }) {
        super(props);
    }
    render() {
        if (this.props.state == 'bomb') {
            return (<Button>💣</Button>)
        }
        else if(this.props.state == 'flag') {
            return (<Button>🚩</Button>)
        }
        else if(this.props.state == 'hidden') {
            return (<Button> </Button>)
        }
        else if(this.props.state == 'blank') {
            return (<Button> </Button>)
        }
        else if(typeof this.props.state == 'number') {
            return (<Button>{this.props.state}</Button>)
        }
    }
}

interface Props {
    board: TileState[][],
    width : number, 
    height : number
}

export const Gameboard: React.FC<Props> = (props) => {
    const grid = [];
    console.log(props);
    
    for (let x = 0; x < props.width; x++) {
        const col = [];
        for (let y = 0; y < props.height; y++) {
            col.push(<Tile state={props.board[x][y]}key={'${x}-${y}'} />);
        }
        grid.push(<div key={x}>{col}</div>);
    }

    return <div>{grid}</div>;
}

export default Gameboard;
