import { SegmentedControl } from "@mantine/core";
import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();

  return (
    <SegmentedControl
      size="xs"
      radius="xl"
      value={i18n.language}
      onChange={(language) => i18n.changeLanguage(language)}
      data={[
        { value: "fr", label: "FR" },
        { value: "en", label: "EN" },
      ]}
    />
  );
};

export default LanguageSwitch;
