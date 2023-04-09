import { Card, Grid } from "@mantine/core";
import socketManager from "component/websocket/SocketManager";
import { Payloads } from "shared/Payloads";

const sm = socketManager;
const SettingsPreset: React.FC<SettingsPresetProps> = (props) => {
  return (
    <Grid.Col>
      <Card onClick={() => sm.setLobbySettings(props.settings)}>
        <Card.Section>{props.label}</Card.Section>
        {props.description}
      </Card>
    </Grid.Col>
  );
};

type SettingsPresetProps = {
  label: string;
  description: string;
  settings: Payloads.LobbySettings;
};

export default SettingsPreset;
