import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSendVerificationCode } from "../../api/queries";

const normalize = (email) => email.trim().toLowerCase();

/**
 * Code de confirmation envoyé par email avant la réservation :
 * à quelle adresse il a été envoyé, le code saisi, et le délai avant un renvoi.
 */
const useEmailVerification = (email) => {
  const { i18n } = useTranslation();
  const request = useSendVerificationCode();
  const [sentTo, setSentTo] = useState(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const timer = setTimeout(() => setResendIn((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);

  // Un code ne vaut que pour l'adresse à laquelle il a été envoyé
  const isSent = !!sentTo && sentTo === normalize(email);

  const send = async () => {
    setError(null);
    try {
      const data = await request.mutateAsync({
        email,
        language: i18n.language,
      });
      setSentTo(normalize(email));
      setCode("");
      setResendIn(data.resendIn);
    } catch (failure) {
      setError(failure.errors?.email?.[0] ?? failure.message);
    }
  };

  return {
    isSent,
    sentTo,
    code,
    setCode: (value) => {
      setError(null);
      setCode(value);
    },
    error,
    setError,
    resendIn,
    isSending: request.isPending,
    send,
  };
};

export default useEmailVerification;
