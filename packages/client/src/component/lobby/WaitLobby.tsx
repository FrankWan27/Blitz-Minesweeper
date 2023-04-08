import { Button, Select } from '@mantine/core';
import socketManager from 'component/websocket/SocketManager';
import React, { useEffect, useState } from 'react';
import { Payloads } from 'shared/Payloads';
import { getName } from 'shared/Utils';
const sm = socketManager;
const WaitLobby: React.FC<{lobbyState: Payloads.LobbyState }> = (props) => {
  console.log(props.lobbyState);
  return (
    <div>
      <PlayerList lobbyState={props.lobbyState}/>
    </div>
  )
}

const PlayerList: React.FC<{lobbyState: Payloads.LobbyState }> = (props) => {
  const [maxPlayers, setMaxPlayers] = useState(2);
  
  useEffect(() => {
    sm.setLobbySettings({lobbyId: props.lobbyState.lobbyId, maxPlayers: maxPlayers})
  }, [maxPlayers, props.lobbyState.lobbyId])

  // useEffect(() => {
  //   setMaxPlayers(props.lobbyState.maxPlayers);
  // }, [props.lobbyState.maxPlayers])

  const playerList = []
  for (const clientId of props.lobbyState.players) {
    playerList.push(<><Player key={playerList.length} name={getName(clientId)}/><br/></>)
  }
  while (playerList.length < maxPlayers) {
    playerList.push(<><Player/><br/></>)
  }
  
  const playerCount = props.lobbyState.players.length;
  return (
    <>
    Players: {playerCount} / {maxPlayers}
    <Select
      placeholder={maxPlayers + " Players"}
      onChange={(s) => setMaxPlayers(Number(s))}
      data={[
        { value: '2', label: '2 Players', disabled: playerCount > 2 },
        { value: '4', label: '4 Players', disabled: playerCount > 4 },
        { value: '8', label: '8 Players' }    
      ]}
    />
    {playerList}
  </>)
}

const Player: React.FC<{name?: string}> = (props) => {
  return (
    <Button>{props.name || 'Waiting for player...'}</Button>
  )
}

export default WaitLobby