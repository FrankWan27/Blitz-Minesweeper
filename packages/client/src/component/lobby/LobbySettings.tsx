import { Grid, Switch, Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons-react";
import socketManager from "component/websocket/SocketManager";
import { Payloads } from "shared/Payloads";
import {
  InsanePreset,
  LargePreset,
  MediumPreset,
  SmallPreset,
} from "./Presets";
import SettingsPreset from "./SettingsPreset";
import SettingsInput from "./SettingsInput";

const sm = socketManager;
const LobbySettings: React.FC<{ lobbySettings: Payloads.LobbySettings }> = (
  props
) => {
  return (
    <>
      <Tabs color="violet" variant="pills" defaultValue="presets">
        <Tabs.List>
          <Tabs.Tab value="presets" icon={<IconPhoto size="1rem" />}>
            Presets
          </Tabs.Tab>
          <Tabs.Tab value="settings" icon={<IconSettings size="1rem" />}>
            Custom Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="presets" pt="xs">
          <Grid>
            <SettingsPreset
              label="Small"
              description="8x8 Board with 10 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...SmallPreset,
              }}
            />
            <SettingsPreset
              label="Medium"
              description="16x16 Board with 40 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...MediumPreset,
              }}
            />
            <SettingsPreset
              label="Large"
              description="30x16 Board with 99 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...LargePreset,
              }}
            />
            <SettingsPreset
              label="Insane"
              description="30x30 Board with 199 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...InsanePreset,
              }}
            />
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xs">
          <SettingsInput
            label="Board Width"
            value={props.lobbySettings.width || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                width: val,
              })
            }
            disabled={sm.getId() !== props.lobbySettings.host}
            max={30}
          />
          <SettingsInput
            label="Board Height"
            value={props.lobbySettings.height || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                height: val,
              })
            }
            disabled={sm.getId() !== props.lobbySettings.host}
            max={30}
          />
          <SettingsInput
            label="Mines"
            value={props.lobbySettings.bombs || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                bombs: val,
              })
            }
            disabled={sm.getId() !== props.lobbySettings.host}
            max={
              (props.lobbySettings.width || 1) *
                (props.lobbySettings.height || 1) -
              1
            }
          />
          <SettingsInput
            label="Time"
            value={props.lobbySettings.time || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                time: val,
              })
            }
            disabled={sm.getId() !== props.lobbySettings.host}
          />
          <SettingsInput
            label="Penalty"
            value={props.lobbySettings.penalty || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                penalty: val,
              })
            }
            disabled={sm.getId() !== props.lobbySettings.host}
          />
          <Switch label="Sudden Death" />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default LobbySettings;