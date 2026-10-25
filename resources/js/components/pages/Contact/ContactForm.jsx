import { useRef } from "react";
import { Button, Stack, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconSend } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import ReCAPTCHA from "react-google-recaptcha";
import { useSendContact } from "../../../api/queries";

const ContactForm = () => {
  const { t } = useTranslation();
  const recaptchaRef = useRef();
  const contact = useSendContact();

  const form = useForm({
    initialValues: { name: "", email: "", subject: "", message: "" },
    validate: {
      name: (value) => (value.trim() ? null : t("contact.name_validation")),
      email: (value) =>
        !value
          ? t("contact.email_required")
          : /^\S+@\S+\.\S+$/.test(value)
            ? null
            : t("contact.email_validation"),
      subject: (value) => (value.trim() ? null : t("contact.subject_validation")),
      message: (value) => (value.trim() ? null : t("contact.message_validation")),
    },
  });

  const submit = async (values) => {
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      notifications.show({ color: "orange", message: t("contact.recaptcha_required") });
      return;
    }

    try {
      await contact.mutateAsync({ ...values, recaptchaToken: token });
      notifications.show({ color: "teal", message: t("contact.sent") });
      form.reset();
    } catch (error) {
      notifications.show({ color: "red", message: error.message || t("common.error") });
    } finally {
      // Un jeton reCAPTCHA ne sert qu'une fois : sans cela, un nouvel essai serait refusé
      recaptchaRef.current?.reset();
    }
  };

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack gap="md">
        <TextInput label={t("contact.name")} autoComplete="name" {...form.getInputProps("name")} />
        <TextInput
          label={t("contact.email")}
          type="email"
          autoComplete="email"
          {...form.getInputProps("email")}
        />
        <TextInput label={t("contact.subject")} {...form.getInputProps("subject")} />
        <Textarea
          label={t("contact.message")}
          autosize
          minRows={5}
          {...form.getInputProps("message")}
        />
        <ReCAPTCHA sitekey="6LeV2q0qAAAAAHkX-olZaIJBgZX7VjcDOdXU7Qb1" ref={recaptchaRef} />
        <Button
          type="submit"
          size="md"
          loading={contact.isPending}
          leftSection={<IconSend size={18} />}
        >
          {t("contact.send")}
        </Button>
      </Stack>
    </form>
  );
};

export default ContactForm;
