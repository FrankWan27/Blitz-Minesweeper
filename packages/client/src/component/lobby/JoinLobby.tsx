import React, { useEffect, useState } from "react";
import socketManager from "../websocket/SocketManager";
import { useLocation } from "react-router-dom";
import {
  Button,
  MantineProvider,
  Modal,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
const sm = socketManager;
const JoinLobby: React.FC<JoinLobbyProps> = (props) => {
  const [name, setName] = useState("");
  const [joinLobby, setJoinLobby] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    sm.setName(name);
  }, [name]);

  let lobbyFromUrl = useLocation().pathname.substring(1);
  if (lobbyFromUrl) {
    sm.joinLobby(lobbyFromUrl);
  }
  return (
    <div className="joinLobby">
      <Modal opened={opened} onClose={close} title="Join Private Lobby">
        <TextInput
          onChange={(e) => setJoinLobby(e.target.value)}
          placeholder="Enter Lobby ID"
        ></TextInput>
        <Button onClick={() => sm.joinLobby(joinLobby)}>Join!</Button>
      </Modal>
      <MantineProvider
        theme={{
          headings: { fontFamily: "Times New Roman, sans-serif" },
        }}
      >
        <Title color="#867070">Blitz Minesweeper</Title>
      </MantineProvider>
      <Stack>
        <TextInput
          placeholder="Enter your name (or leave blank for a random one)"
          onChange={(e) => setName(e.target.value)}
        />
        <Button color="blue.3" variant="outline" onClick={() => sm.quickJoin()}>
          Quick Join!
        </Button>
        <Button color="blue.3" variant="outline" onClick={() => sm.createLobby()}>
          Create Lobby
        </Button>
        <Button color="blue.3" variant="outline" onClick={open}>
          Join Private Lobby
        </Button>
      </Stack>
    </div>
  );
};

type JoinLobbyProps = {
  setLobbyId: (s: string) => void;
};

export default JoinLobby;
