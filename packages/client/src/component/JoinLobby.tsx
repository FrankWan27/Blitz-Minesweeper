import React from 'react'
import socketManager from './websocket/SocketManager';

const JoinLobby = () => {
  const sm = socketManager;
  
  return (
    <div>
    <form className='input'>
    <input type="input" className="inputBox" placeholder="Enter LobbyID"/>  
    </form>
    <button onClick={() => sm.createLobby()}>Create</button>
    <button onClick={() => sm.joinLobby("lobbyID")}>Join</button></div>
    )
}

export default JoinLobby