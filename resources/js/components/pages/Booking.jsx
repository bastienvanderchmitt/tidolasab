import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Button, Container, Group, Stepper, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconArrowRight,
  IconMail,
  IconSend,
} from "@tabler/icons-react";
import { useBookingContext } from "../../contexts/BookingContext";
import { useSaveBooking } from "../../api/queries";
import { validateStay } from "../../helpers/availability";
import { countryName } from "../../helpers/countries";
import {
  isAddress,
  isEmail,
  isPhone,
  isPostalCode,
} from "../../helpers/validation";
import StayStep from "../booking/StayStep";
import ClientStep, { clientFields } from "../booking/ClientStep";
import ReviewStep from "../booking/ReviewStep";
import BookingSummaryCard from "../booking/BookingSummaryCard";
import { MAX_ADULTS } from "../booking/GuestsInput";
import { bookingSearch } from "../booking/bookingSearch";
import useEmailVerification from "../booking/useEmailVerification";
import { formatPrice } from "../booking/format";
import Room from "./Booking/Room";
import { scrollBehavior } from "../../helpers/motion";
import classes from "../booking/Booking.module.css";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const Booking = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    checkIn,
    checkOut,
    setStay,
    adults,
    setAdults,
    quote,
    pricing,
    taken,
    isLoadingBookings,
    setBooked,
  } = useBookingContext();
  const save = useSaveBooking();
  const [step, setStep] = useState(0);
  const mainRef = useRef(null);
  const urlRead = useRef(false);

  const form = useForm({
    // Le pays est un code ISO, la France par défaut
    initialValues: {
      ...Object.fromEntries(clientFields.map(({ name }) => [name, ""])),
      country: "FR",
    },
    validate: {
      ...Object.fromEntries(
        clientFields.map(({ name }) => [
          name,
          (value) => (value?.trim() ? null : t(`client.${name}_validation`)),
        ]),
      ),
      email: (value) => (isEmail(value) ? null : t("client.email_validation")),
      phone: (value) =>
        !value.trim()
          ? t("client.phone_validation")
          : isPhone(value)
            ? null
            : t("client.phone_format"),
      address: (value) =>
        !value.trim()
          ? t("client.address_validation")
          : isAddress(value)
            ? null
            : t("client.address_format"),
      postalCode: (value, values) =>
        !value.trim()
          ? t("client.postalCode_validation")
          : isPostalCode(value, values.country)
            ? null
            : t("client.postalCode_format"),
      city: (value) =>
        /\p{L}/u.test(value) ? null : t("client.city_validation"),
    },
  });

  const verification = useEmailVerification(form.values.email);

  // Séjour transmis par la barre rapide ou par un lien partagé
  useEffect(() => {
    const urlCheckIn = searchParams.get("checkIn");
    const urlCheckOut = searchParams.get("checkOut");
    const urlAdults = Number(searchParams.get("adults"));

    if (ISO_DATE.test(urlCheckIn ?? "")) {
      setStay([
        urlCheckIn,
        ISO_DATE.test(urlCheckOut ?? "") ? urlCheckOut : null,
      ]);
    }
    if (urlAdults >= 1) setAdults(Math.min(urlAdults, MAX_ADULTS));
    urlRead.current = true;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // L'URL suit le séjour choisi, pour pouvoir le partager
  useEffect(() => {
    if (!urlRead.current) return;
    setSearchParams(bookingSearch(checkIn, checkOut, adults), {
      replace: true,
      preventScrollReset: true,
    });
  }, [checkIn, checkOut, adults, setSearchParams]);

  const stayError =
    checkIn && checkOut
      ? validateStay(checkIn, checkOut, taken, pricing)
      : null;
  const stayReady = !!checkIn && !!checkOut && !stayError && !isLoadingBookings;

  // Arrivée avec un séjour valide : on passe directement aux coordonnées
  const skippedDates = useRef(false);
  useEffect(() => {
    if (skippedDates.current || isLoadingBookings || !pricing) return;
    skippedDates.current = true;
    if (stayReady) setStep(1);
  }, [isLoadingBookings, pricing, stayReady]);

  const goTo = (nextStep) => {
    setStep(nextStep);
    mainRef.current?.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  };

  const submit = async (code = verification.code) => {
    // La saisie du dernier chiffre envoie aussi la demande : pas de double envoi
    if (save.isPending) return;
    try {
      await save.mutateAsync({
        ...form.values,
        // Nom du pays en français pour l'admin, code ISO pour la validation
        country: countryName(form.values.country, "fr"),
        countryCode: form.values.country,
        checkIn,
        checkOut,
        adults,
        children: 0,
        // Exigé par l'API quand une session admin est ouverte dans le navigateur
        type: "Classique",
        language: i18n.language,
        verificationCode: code,
      });
      setBooked({ checkIn, checkOut, adults, quote });
      setStay([null, null]);
      navigate("/success");
    } catch (error) {
      // Code faux ou expiré : affiché sous la saisie du code
      const codeError = error.errors?.verificationCode?.[0];
      if (codeError) {
        verification.setError(codeError);
        return;
      }

      const fieldErrors = Object.fromEntries(
        Object.entries(error.errors ?? {})
          .map(([field, messages]) => [
            field === "countryCode" ? "country" : field,
            messages,
          ])
          .filter(([field]) => field in form.values)
          .map(([field, messages]) => [field, messages[0]]),
      );
      if (Object.keys(fieldErrors).length) {
        form.setErrors(fieldErrors);
        goTo(1);
      }
      notifications.show({
        color: "red",
        message: error.message || t("common.error"),
      });
    }
  };

  const next = () => {
    if (step === 0 && stayReady) goTo(1);
    if (step === 1 && !form.validate().hasErrors) goTo(2);
    // Dernière étape : d'abord le code par email, puis la réservation
    if (step === 2 && !verification.isSent) verification.send();
    if (step === 2 && verification.isSent && verification.code.length === 6) {
      submit();
    }
  };

  const nextLabel =
    step < 2
      ? t("common.continue")
      : verification.isSent
        ? t("review.submit")
        : t("verify.send_code");
  const nextDisabled =
    (step === 0 && !stayReady) ||
    (step === 2 && verification.isSent && verification.code.length < 6);
  const nextLoading = save.isPending || verification.isSending;
  const nextIcon =
    step < 2 ? (
      <IconArrowRight size={18} />
    ) : verification.isSent ? (
      <IconSend size={18} />
    ) : (
      <IconMail size={18} />
    );

  return (
    <div className={classes.page}>
      <Container size="lg" mt={-56} pos="relative">
        <div className={classes.layout}>
          <section ref={mainRef} className={classes.main}>
            <Stepper
              active={step}
              onStepClick={goTo}
              allowNextStepsSelect={false}
              size="sm"
              mb={32}
              classNames={{ step: classes.step, stepBody: classes.stepBody }}
            >
              <Stepper.Step label={t("stepper.dates")} />
              <Stepper.Step label={t("stepper.contact")} />
              <Stepper.Step label={t("stepper.review")} />
            </Stepper>

            {step === 0 && <StayStep error={stayError} />}
            {step === 1 && <ClientStep form={form} />}
            {step === 2 && (
              <ReviewStep
                form={form}
                goTo={goTo}
                verification={verification}
                onCodeComplete={submit}
              />
            )}

            <Group justify="space-between" className={classes.actions}>
              {step > 0 ? (
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<IconArrowLeft size={18} />}
                  onClick={() => goTo(step - 1)}
                >
                  {t("common.back")}
                </Button>
              ) : (
                <span />
              )}
              <Button
                size="md"
                onClick={next}
                disabled={nextDisabled}
                loading={nextLoading}
                rightSection={nextIcon}
                visibleFrom="md"
              >
                {nextLabel}
              </Button>
            </Group>
          </section>

          <Box visibleFrom="md">
            <BookingSummaryCard />
          </Box>
        </div>
      </Container>

      <Room />

      <Box hiddenFrom="md" className={classes.mobileBar}>
        <div>
          {quote?.nights ? (
            <>
              <Text fw={600}>{formatPrice(quote.total)}</Text>
              <Text size="xs" c="dimmed">
                {t("quick.nights", { count: quote.nights })}
              </Text>
            </>
          ) : (
            <Text size="sm" c="dimmed">
              {t("stay.no_dates")}
            </Text>
          )}
        </div>
        <Button
          onClick={next}
          disabled={nextDisabled}
          loading={nextLoading}
          rightSection={nextIcon}
        >
          {nextLabel}
        </Button>
      </Box>
    </div>
  );
};

export default Booking;
