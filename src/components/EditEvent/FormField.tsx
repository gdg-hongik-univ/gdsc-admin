import { Text } from "components/@common/Text";
import Box from "wowds-ui/Box";
import RadioButton from "wowds-ui/RadioButton";
import RadioGroup from "wowds-ui/RadioGroup";
import Switch from "wowds-ui/Switch";
import { Flex } from "../@common/Flex";

type Option = { value: string; label: string };

type OptionalControlled = {
  optional?: boolean;
  optionalChecked?: boolean;
  onOptionalChange?: (checked: boolean) => void;
};

interface TextFieldProps extends OptionalControlled {
  id: string;
  type: "textfield";
  title: string;
  value: string;
  isDisabled?: boolean;
}

interface OptionSelectProps extends OptionalControlled {
  id: string;
  type: "option-select";
  title: string;
  options: Option[];
  isDisabled?: boolean;
}

export type FormFieldProps = TextFieldProps | OptionSelectProps;

export const FormField = (props: FormFieldProps) => {
  const { title, type, optional = false, isDisabled = false } = props;

  const enabled = "optional" in props && props.optional ? props.optionalChecked : true;

  const handleSwitchChange = () => {
    if ("optional" in props && props.optional === true && props.onOptionalChange) {
      props.onOptionalChange(!props.optionalChecked);
    }
  };

  return (
    <Box
      text={
        <Flex direction="column" gap="sm" align="normal">
          <Flex gap="sm" justify="start">
            <Text as="h2" typo="h2">
              {title}
            </Text>
            <Text typo="body2" color="primary">
              *필수 입력
            </Text>
          </Flex>

          {type === "textfield" ? (
            <Text typo="body1" color="outline">
              {props.value}
            </Text>
          ) : (
            <RadioGroup defaultValue={props.options[0].value ?? ""} name={title}>
              {props.options.map(opt => (
                <RadioButton key={opt.value} value={opt.value} label={opt.label} />
              ))}
            </RadioGroup>
          )}
          {optional && (
            <Switch
              style={{ justifyContent: "flex-end" }}
              checked={enabled}
              onChange={handleSwitchChange}
              value={title}
              disabled={isDisabled}
            />
          )}
        </Flex>
      }
      style={{ minWidth: "100%" }}
    />
  );
};
