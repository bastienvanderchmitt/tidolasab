import { List, Progress, Stack, ThemeIcon } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { passwordRules } from "./passwordRules";

/**
 * Critères du mot de passe, cochés au fil de la saisie.
 */
const PasswordRequirements = ({ value }) => {
  const passed = passwordRules.filter((rule) => rule.test(value)).length;
  const strength = (passed / passwordRules.length) * 100;

  return (
    <Stack gap={6}>
      <Progress
        value={strength}
        size={4}
        color={strength === 100 ? "teal" : strength >= 50 ? "yellow" : "red"}
      />
      <List size="xs" spacing={2} center>
        {passwordRules.map((rule) => {
          const ok = rule.test(value);
          return (
            <List.Item
              key={rule.label}
              c={ok ? "teal" : "dimmed"}
              icon={
                <ThemeIcon size={14} radius="xl" color={ok ? "teal" : "gray"} variant="light">
                  {ok ? <IconCheck size={10} /> : <IconX size={10} />}
                </ThemeIcon>
              }
            >
              {rule.label}
            </List.Item>
          );
        })}
      </List>
    </Stack>
  );
};

export default PasswordRequirements;
