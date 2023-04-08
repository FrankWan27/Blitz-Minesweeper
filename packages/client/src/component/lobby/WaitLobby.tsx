import { Button, Select } from '@mantine/core';
import socketManager from 'component/websocket/SocketManager';
import React, { useEffect, useState } from 'react';
import { Payloads } from 'shared/Payloads';
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
  const [maxPlayers, setMaxPlayers] = useState(props.lobbyState.maxPlayers);
  
  useEffect(() => {
    sm.changeMaxPlayers(props.lobbyState.lobbyId, maxPlayers)
  }, [maxPlayers, props.lobbyState.lobbyId])

  useEffect(() => {
    setMaxPlayers(props.lobbyState.maxPlayers);
  }, [props.lobbyState.maxPlayers])

  const playerList = []
  for (const name of Object.values(props.lobbyState.clientNames)) {
    playerList.push(<><Player name={name}/><br/></>)
  }
  while (playerList.length < maxPlayers) {
    playerList.push(<><Player/><br/></>)
  }
  
  return (
    <>
    Players: {props.lobbyState.playerCount} / {maxPlayers}
    <Select
      placeholder={maxPlayers + " Players"}
      onChange={(s) => setMaxPlayers(Number(s))}
      data={[
        { value: '2', label: '2 Players', disabled:props.lobbyState.playerCount > 2 },
        { value: '4', label: '4 Players', disabled:props.lobbyState.playerCount > 4},
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