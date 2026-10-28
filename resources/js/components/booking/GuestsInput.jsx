import { ActionIcon, Group, Text } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useBookingContext } from "../../contexts/BookingContext";

export const MAX_ADULTS = 2;

const GuestsInput = () => {
  const { t } = useTranslation();
  const { adults, setAdults } = useBookingContext();

  return (
    <Group gap="sm" wrap="nowrap">
      <ActionIcon
        variant="default"
        radius="xl"
        size="lg"
        onClick={() => setAdults(adults - 1)}
        disabled={adults <= 1}
        aria-label={t("a11y.remove_adult")}
      >
        <IconMinus size={16} />
      </ActionIcon>
      <Text fw={500} miw={86} ta="center">
        {t("booking.adults_count", { count: adults })}
      </Text>
      <ActionIcon
        variant="default"
        radius="xl"
        size="lg"
        onClick={() => setAdults(adults + 1)}
        disabled={adults >= MAX_ADULTS}
        aria-label={t("a11y.add_adult")}
      >
        <IconPlus size={16} />
      </ActionIcon>
    </Group>
  );
};

export default GuestsInput;
