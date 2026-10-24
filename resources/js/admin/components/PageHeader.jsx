import { Group, Stack, Text, Title } from "@mantine/core";

const PageHeader = ({ title, description, children }) => (
  <Group justify="space-between" align="flex-end" mb="lg" wrap="wrap" gap="sm">
    <Stack gap={2}>
      <Title order={2}>{title}</Title>
      {description && (
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      )}
    </Stack>
    {children && <Group gap="sm">{children}</Group>}
  </Group>
);

export default PageHeader;
