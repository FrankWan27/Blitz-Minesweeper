import React, { useState } from 'react'
import socketManager from '../websocket/SocketManager';
import { useLocation } from 'react-router-dom';
import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Payloads } from 'shared/Payloads';
const WaitLobby: React.FC<{lobbyState: Payloads.LobbyState }> = (props) => {
  console.log(props.lobbyState);
  return (
    <div>
      Players Connected:{props.lobbyState.playerCount}
      {JSON.stringify(props.lobbyState.clientNames)}
      <br/>
    </div>
  )
}

export default WaitLobby