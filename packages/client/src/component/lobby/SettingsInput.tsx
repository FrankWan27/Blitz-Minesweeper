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
      <Group spacing={5}>
        {props.label}
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
          min={1}
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
    </div>
  );
};

type SettingsInputProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  max?: number;
  disabled?: boolean;
};

export default SettingsInput;
