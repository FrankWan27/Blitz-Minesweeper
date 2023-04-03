import React, { useState } from 'react';
import './App.css';
import JoinLobby from './component/JoinLobby';
import SocketManager from './component/websocket/SocketManager';
import GameManager from './component/GameManager';
import { BrowserRouter, useLocation } from "react-router-dom";
import { Notifications } from '@mantine/notifications';

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");  

  return <div className='App'>
    <span className='heading'>Blitz Minesweeper</span>
    <BrowserRouter>
      <Notifications />
      <GameManager/>
    </BrowserRouter>
  </div>
}

export default App;
