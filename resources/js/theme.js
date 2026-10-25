import { createTheme } from "@mantine/core";

// Thème du site public : turquoise du lagon, sable en accent, polices d'origine
export const theme = createTheme({
  primaryColor: "lagon",
  primaryShade: 7,
  colors: {
    lagon: [
      "#e1fbfc",
      "#cff2f4",
      "#a2e3e7",
      "#70d4d9",
      "#49c7ce",
      "#30bfc7",
      "#1ebbc3",
      "#0ea1ab",
      "#008f98",
      "#007c84",
    ],
    sable: [
      "#fbf8f3",
      "#f4ede2",
      "#ebdfcb",
      "#e3cfb4",
      "#d6bc98",
      "#c9ab83",
      "#b99d75",
      "#a1835b",
      "#86694a",
      "#6b5339",
    ],
  },
  black: "#22303a",
  defaultRadius: "md",
  fontFamily: "Jost, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  headings: {
    fontFamily: "Marcellus, Georgia, serif",
    fontWeight: "400",
  },
  components: {
    Button: { defaultProps: { radius: "xl" } },
    Card: { defaultProps: { radius: "lg" } },
    Paper: { defaultProps: { radius: "lg" } },
    Modal: { defaultProps: { radius: "lg", centered: true } },
    TextInput: { defaultProps: { radius: "md", size: "md" } },
    Textarea: { defaultProps: { radius: "md", size: "md" } },
    Select: { defaultProps: { radius: "md", size: "md" } },
  },
});
