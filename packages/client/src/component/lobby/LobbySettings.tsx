import {
  ActionIcon,
  Card,
  Grid,
  Group,
  NumberInput,
  NumberInputHandlers,
  Switch,
  Tabs,
  rem,
} from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons-react";
import socketManager from "component/websocket/SocketManager";
import { useRef } from "react";
import { Payloads } from "shared/Payloads";
import {
  InsanePreset,
  LargePreset,
  MediumPreset,
  SmallPreset,
} from "./Presets";

const sm = socketManager;
const LobbySettings: React.FC<{ lobbySettings: Payloads.LobbySettings }> = (
  props
) => {
  console.log(props.lobbySettings.width);
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
            <SettingPreset
              label="Small"
              description="8x8 Board with 10 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...SmallPreset,
              }}
            />
            <SettingPreset
              label="Medium"
              description="16x16 Board with 40 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...MediumPreset,
              }}
            />
            <SettingPreset
              label="Large"
              description="30x16 Board with 99 Mines"
              settings={{
                lobbyId: props.lobbySettings.lobbyId,
                ...LargePreset,
              }}
            />
            <SettingPreset
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
          <SettingInput
            label="Board Width"
            value={props.lobbySettings.width || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                width: val,
              })
            }
            max={30}
          />
          <SettingInput
            label="Board Height"
            value={props.lobbySettings.height || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                height: val,
              })
            }
            max={30}
          />
          <SettingInput
            label="Mines"
            value={props.lobbySettings.bombs || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                bombs: val,
              })
            }
            max={
              (props.lobbySettings.width || 1) *
                (props.lobbySettings.height || 1) -
              1
            }
          />
          <SettingInput
            label="Time"
            value={props.lobbySettings.time || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                time: val,
              })
            }
          />
          <SettingInput
            label="Penalty"
            value={props.lobbySettings.penalty || 0}
            onChange={(val) =>
              sm.setLobbySettings({
                lobbyId: props.lobbySettings.lobbyId,
                penalty: val,
              })
            }
          />
          <Switch label="Sudden Death" />
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

const SettingPreset: React.FC<SettingsPresetProps> = (props) => {
  return (
    <Grid.Col>
      <Card onClick={() => sm.setLobbySettings(props.settings)}>
        <Card.Section>{props.label}</Card.Section>
        {props.description}
      </Card>
    </Grid.Col>
  );
};

const SettingInput: React.FC<SettingsInputProps> = (props) => {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <div className="settingInput">
      <Group spacing={5}>
        {props.label}
        <ActionIcon
          size={42}
          variant="default"
          onClick={() => handlers.current?.decrement()}
        >
          –
        </ActionIcon>
        <NumberInput
          hideControls
          value={props.value}
          onChange={props.onChange}
          handlersRef={handlers}
          min={1}
          max={props.max}
          styles={{ input: { width: rem(54), textAlign: "center" } }}
        />

        <ActionIcon
          size={42}
          variant="default"
          onClick={() => handlers.current?.increment()}
        >
          +
        </ActionIcon>
      </Group>
    </div>
  );
};
type SettingsPresetProps = {
  label: string;
  description: string;
  settings: Payloads.LobbySettings;
};

type SettingsInputProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  max?: number;
};

export default LobbySettings;
