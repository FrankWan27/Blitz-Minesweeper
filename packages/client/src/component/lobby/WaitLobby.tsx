import { ActionIcon, Button, Group, Select, Stack } from "@mantine/core";
import socketManager from "component/websocket/SocketManager";
import React, { useEffect, useState } from "react";
import { Payloads } from "shared/Payloads";
import { getName } from "shared/Utils";
import LobbySettings from "./LobbySettings";
import { IconArrowBackUp, IconLink, IconPlayerPlay } from "@tabler/icons-react";
const sm = socketManager;
const WaitLobby: React.FC<WaitLobbyProps> = (props) => {
  return (
    <Group position="center">
      <ActionIcon onClick={() => sm.leaveLobby()}>
        <IconArrowBackUp size="xl" />
      </ActionIcon>
      <PlayerList
        lobbyState={props.lobbyState}
        lobbySettings={props.lobbySettings}
      />
      <Stack>
        <LobbySettings lobbySettings={props.lobbySettings} />
        <Group>
          <Button
            leftIcon={<IconLink />}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            Invite
          </Button>
          <Button
            leftIcon={<IconPlayerPlay />}
            disabled={sm.getId() !== props.lobbySettings.host}
            onClick={() => sm.startGame(props.lobbySettings.lobbyId)}
          >
            Start Game
          </Button>
        </Group>
      </Stack>
    </Group>
  );
};

const PlayerList: React.FC<WaitLobbyProps> = (props) => {
  const [maxPlayers, setMaxPlayers] = useState(2);

  useEffect(() => {
    setMaxPlayers(props.lobbySettings.maxPlayers || 2);
  }, [props.lobbySettings.maxPlayers]);

  const playerList = [];
  for (const clientId of props.lobbyState.players) {
    playerList.push(
      <>
        <Player
          key={playerList.length}
          name={getName(clientId)}
          isHost={clientId === props.lobbySettings.host}
        />
        <br />
      </>
    );
  }
  while (playerList.length < maxPlayers) {
    playerList.push(
      <>
        <Player />
        <br />
      </>
    );
  }

  const playerCount = props.lobbyState.players.length;
  return (
    <div className="list">
      Players: {playerCount} / {maxPlayers}
      <Select
        disabled={sm.getId() !== props.lobbySettings.host}
        placeholder={maxPlayers + " Players"}
        onChange={(s) =>
          sm.setLobbySettings({
            lobbyId: props.lobbyState.lobbyId,
            maxPlayers: Number(s),
          })
        }
        data={[
          { value: "2", label: "2 Players", disabled: playerCount > 2 },
          { value: "4", label: "4 Players", disabled: playerCount > 4 },
          { value: "8", label: "8 Players" },
        ]}
      />
      {playerList}
    </div>
  );
};

const Player: React.FC<{ name?: string; isHost?: boolean }> = (props) => {
  return (
    <Button>
      {props.name || "Waiting for player..."} {props.isHost ? " (Host)" : ""}
    </Button>
  );
};

export type WaitLobbyProps = {
  lobbyState: Payloads.LobbyState;
  lobbySettings: Payloads.LobbySettings;
};

export default WaitLobby;
