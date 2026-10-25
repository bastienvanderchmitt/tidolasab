import {
  Alert,
  Button,
  Group,
  Paper,
  PinInput,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconMail, IconMailCheck } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

/**
 * Dernière étape : le code reçu par email confirme l'adresse avant l'envoi du contrat.
 */
const VerificationPanel = ({
  verification,
  email,
  onComplete,
  onEditEmail,
}) => {
  const { t } = useTranslation();

  if (!verification.isSent) {
    return (
      <Alert color="lagon" variant="light" icon={<IconMail size={18} />}>
        {t("verify.explain", { email })}
        {verification.error && (
          <Text c="red" size="sm" mt="xs">
            {verification.error}
          </Text>
        )}
      </Alert>
    );
  }

  return (
    <Paper withBorder p="lg">
      <Stack align="center" gap="sm" ta="center">
        <ThemeIcon size={44} radius="xl" variant="light" color="lagon">
          <IconMailCheck size={24} />
        </ThemeIcon>
        <Text fw={600}>{t("verify.title")}</Text>
        <Text size="sm" c="dimmed">
          {t("verify.sent", { email: verification.sentTo })}
        </Text>
        <PinInput
          length={6}
          type="number"
          size="lg"
          oneTimeCode
          autoFocus
          value={verification.code}
          onChange={verification.setCode}
          onComplete={onComplete}
          error={!!verification.error}
          aria-label={t("verify.title")}
        />
        {verification.error && (
          <Text c="red" size="sm">
            {verification.error}
          </Text>
        )}
        <Group gap="xs" justify="center">
          <Button
            variant="subtle"
            size="xs"
            onClick={verification.send}
            loading={verification.isSending}
            disabled={verification.resendIn > 0}
          >
            {verification.resendIn > 0
              ? t("verify.resend_in", { seconds: verification.resendIn })
              : t("verify.resend")}
          </Button>
          <Button variant="subtle" size="xs" color="gray" onClick={onEditEmail}>
            {t("verify.edit_email")}
          </Button>
        </Group>
        <Text size="xs" c="dimmed">
          {t("verify.spam")}
        </Text>
      </Stack>
    </Paper>
  );
};

export default VerificationPanel;
