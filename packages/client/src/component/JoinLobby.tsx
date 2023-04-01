import React from 'react'
import SocketManager from './websocket/SocketManager';

const JoinLobby = () => {
  //const sm = new SocketManager();
  
  return (
    <div><form className='input'>
        <input type="input" className="inputBox" placeholder="Enter LobbyID"/>
        
    </form>
    <button onClick={() => {}}>Join</button></div>
  )
}

export default JoinLobby