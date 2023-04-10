import {
  ActionIcon,
  Group,
  NumberInput,
  NumberInputHandlers,
  rem,
} from "@mantine/core";
import { useRef } from "react";

const SettingsInput: React.FC<SettingsInputProps> = (props) => {
  const handlers = useRef<NumberInputHandlers>();

  return (
    <div className="settingInput">
      <Group position="apart">
        {props.label}
        <Group spacing={5}>
          <ActionIcon
            size={42}
            variant="default"
            onClick={() => handlers.current?.decrement()}
            disabled={props.disabled}
          >
            –
          </ActionIcon>
          <NumberInput
            hideControls
            value={props.value}
            onChange={props.onChange}
            handlersRef={handlers}
            min={props.min || 1}
            max={props.max}
            styles={{ input: { width: rem(54), textAlign: "center" } }}
          />

          <ActionIcon
            size={42}
            variant="default"
            onClick={() => handlers.current?.increment()}
            disabled={props.disabled}
          >
            +
          </ActionIcon>
        </Group>
      </Group>
    </div>
  );
};

type SettingsInputProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
};

export default SettingsInput;
