import { Card, Group, Text, ThemeIcon } from "@mantine/core";

const StatCard = ({ label, value, hint, icon: Icon, color = "lagon" }) => (
  <Card>
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <div>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {label}
        </Text>
        <Text
          fz={26}
          fw={700}
          mt={4}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </Text>
        {hint && (
          <Text size="xs" c="dimmed" mt={2}>
            {hint}
          </Text>
        )}
      </div>
      {Icon && (
        <ThemeIcon variant="light" color={color} size={42} radius="md">
          <Icon size={22} stroke={1.6} />
        </ThemeIcon>
      )}
    </Group>
  </Card>
);

export default StatCard;
