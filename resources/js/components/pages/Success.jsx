import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Container, Paper, SimpleGrid, Stack, Text, ThemeIcon, Timeline } from "@mantine/core";
import { IconCheck, IconMail, IconCoinEuro, IconBeach } from "@tabler/icons-react";
import { useBookingContext } from "../../contexts/BookingContext";
import { nightsBetween, today } from "../../helpers/availability";
import PriceSummary from "../booking/PriceSummary";
import { formatDate, formatPrice } from "../booking/format";
import classes from "./Success.module.css";

const Success = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { booked, pricing } = useBookingContext();

  useEffect(() => {
    if (!booked) navigate("/");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!booked) return null;

  const { checkIn, checkOut, adults, quote } = booked;
  const depositPercent = pricing?.deposit_percent ?? 50;
  const balanceDays = pricing?.balance_due_days ?? 14;

  return (
    <Container size="lg" className="section">
      <Stack align="center" gap="xs" ta="center" mb={48}>
        <ThemeIcon size={64} radius="xl" color="lagon">
          <IconCheck size={34} />
        </ThemeIcon>
        <h2 className={classes.title}>{t("success.title")}</h2>
        <Text className="handwritten" fz={26} c="lagon.8">
          {t("success.countdown", { count: nightsBetween(today(), checkIn) })}
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing={40}>
        <Paper p="xl" className={classes.card}>
          <Text className="eyebrow" mb="md">
            {t("success.subtitle")}
          </Text>
          <Text fw={500}>
            {formatDate(checkIn, { weekday: "long", year: "numeric" })} →{" "}
            {formatDate(checkOut, { weekday: "long", year: "numeric" })}
          </Text>
          <Text size="sm" c="dimmed" mb="lg">
            {t("quick.nights", { count: quote?.nights ?? 0 })} ·{" "}
            {t("booking.adults_count", { count: adults })}
          </Text>
          <PriceSummary quote={quote} />
        </Paper>

        <Paper p="xl" className={classes.card}>
          <Text className="eyebrow" mb="lg">
            {t("success.next_steps")}
          </Text>
          <Timeline active={0} bulletSize={32} lineWidth={2}>
            <Timeline.Item bullet={<IconMail size={16} />} title={t("success.step_email")}>
              <Text size="sm" c="dimmed">
                {t("success.step_email_text")}
              </Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconCoinEuro size={16} />} title={t("success.step_deposit")}>
              <Text size="sm" c="dimmed">
                {t("success.step_deposit_text", {
                  percent: depositPercent,
                  amount: formatPrice(((quote?.total ?? 0) * depositPercent) / 100),
                })}
              </Text>
            </Timeline.Item>
            <Timeline.Item bullet={<IconBeach size={16} />} title={t("success.step_balance")}>
              <Text size="sm" c="dimmed">
                {t("success.step_balance_text", { days: balanceDays })}
              </Text>
            </Timeline.Item>
          </Timeline>
        </Paper>
      </SimpleGrid>

      <Stack align="center" mt={56} gap="md" ta="center">
        <Text c="dimmed">{t("success.activities_text")}</Text>
        <Button component={Link} to="/activities" variant="light">
          {t("success.activities")}
        </Button>
      </Stack>
    </Container>
  );
};

export default Success;
