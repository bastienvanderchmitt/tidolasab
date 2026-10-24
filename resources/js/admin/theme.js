import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "lagon",
  colors: {
    // Turquoise du site (#0ea1ab)
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
  },
  defaultRadius: "md",
  fontFamily:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  headings: { fontWeight: "650" },
  components: {
    Card: { defaultProps: { withBorder: true, radius: "lg", padding: "lg" } },
    Paper: { defaultProps: { radius: "lg" } },
    Modal: { defaultProps: { radius: "lg", centered: true } },
    Table: { defaultProps: { verticalSpacing: "sm", highlightOnHover: true } },
  },
});
