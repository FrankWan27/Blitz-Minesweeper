import React from 'react'
import socketManager from './websocket/SocketManager';
import { useLocation } from 'react-router-dom';

const JoinLobby = () => {
  const sm = socketManager;
  let lobbyId = useLocation().pathname.substring(1);
  console.log(lobbyId);
  
  return (
    <div>
    {/* <form className='input'>
    <input type="input" className="inputBox" placeholder="Enter LobbyID"/>  
    </form> */}
    <button onClick={() => sm.createLobby()}>Create</button>
    <button onClick={() => sm.joinLobby(lobbyId)}>Join</button></div>
    )
}

export default JoinLobby