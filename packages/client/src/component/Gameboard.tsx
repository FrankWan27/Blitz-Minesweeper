import React from "react";

const Tile: React.FC<{
    value: number | "X";
    onClick: () => void;
    onRightClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  }> = ({ value, onClick, onRightClick }) => (
    <button className="tile" onClick={onClick} onContextMenu={onRightClick}>
      {value}
    </button>
  );

export default class Gameboard extends React.Component {
    state = {
        height: this.props.height,
        width: this.props.width,
        mines: this.props.mines
    }
    render() {
        return <Tile/>;
      }
}




