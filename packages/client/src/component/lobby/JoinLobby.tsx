import React, { useState } from 'react'
import socketManager from '../websocket/SocketManager';
import { useLocation } from 'react-router-dom';
import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
const sm = socketManager;
const JoinLobby: React.FC<JoinLobbyProps> = (props) => {
  const [name, setName] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  let lobbyFromUrl = useLocation().pathname.substring(1);
  if (lobbyFromUrl) {
    props.setLobbyId(lobbyFromUrl);
  }
  return (
    <div>
      <Modal opened={opened} onClose={close} title="Join Private Lobby">
        <TextInput placeholder="Enter Lobby ID"></TextInput>
        <Button>Join!</Button>
      </Modal>
      <TextInput
        placeholder="Enter your name (or leave blank for a random one)"
        onChange={(e) => setName(e.target.value)}
      />
      <Button color="green.4" onClick={() => sm.quickJoin()}>Quick Join!</Button><br/>
      <Button onClick={() => sm.createLobby()}>Create Lobby</Button>
      <Button color="grape" onClick={() => open}>Join Private Lobby</Button>
    </div>
  )
}

type JoinLobbyProps = {
  setLobbyId: (s: string) => void
}

export default JoinLobby