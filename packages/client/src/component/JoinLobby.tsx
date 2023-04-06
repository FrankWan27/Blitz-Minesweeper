import React, { useState } from 'react'
import socketManager from './websocket/SocketManager';
import { useLocation } from 'react-router-dom';
import { Button, TextInput } from '@mantine/core';
const sm = socketManager;
const JoinLobby = () => {
  const [name, setName] = useState("");
  let lobbyId = useLocation().pathname.substring(1);
  return (
    <div>
      <TextInput
        placeholder="Enter your name (or leave blank for a random one)"
        onChange={(e) => setName(e.target.value)}
      />
      <Button color="green.4" onClick={() => sm.quickJoin()}>Quick Join!</Button><br/>
      <Button onClick={() => sm.createLobby()}>Create Lobby</Button>
      <Button onClick={() => sm.joinLobby(lobbyId)}>Join Private Room</Button>
    </div>
  )
}
const names = ["Shaquille Oatmeal", "Kanye East", "Egg Sheeran", "Danny Dorito", "Saul Badman", "Chairman Meow", "Meowssolini", "Karl Barx", "Fidel Catstro", "Hilary Kitten", "Isaac Mewton"];

function pickName(name: string) : string {
  if (name) {
    return name;
  } 
  return names[Math.floor(Math.random() * names.length)];
}

export default JoinLobby