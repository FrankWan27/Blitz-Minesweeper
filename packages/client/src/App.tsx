import React, { useState } from 'react';
import './App.css';
import JoinLobby from './component/JoinLobby';
import SocketManager from './component/websocket/SocketManager';
import GameManager from './component/GameManager';
import { BrowserRouter, useLocation } from "react-router-dom";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  console.log(window.history.pushState("", "", "/new-url"));
  return <div className='App'>
    <span className='heading'>Blitz Minesweeper</span>
    <JoinLobby/>
    <GameManager/>
  </div>
}

export default App;
