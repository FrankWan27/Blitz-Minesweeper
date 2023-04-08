import React from 'react';
import './App.css';
import GameManager from './component/GameManager';
import { BrowserRouter } from "react-router-dom";
import { Notifications } from '@mantine/notifications';

const App: React.FC = () => {
  return <div className='App'>
    <span className='heading'>Blitz Minesweeper</span>
    <BrowserRouter>
      <Notifications />
      <GameManager />
    </BrowserRouter>
  </div>
}

export default App;
