// theme.js

export const colorTokens = {
  grey: {
    0: "#FFFFFF",
    10: "#F6F6F6",
    50: "#F0F0F0",
    100: "#E0E0E0",
    200: "#C2C2C2",
    300: "#A3A3A3",
    400: "#858585",
    500: "#666666",
    600: "#4D4D4D",
    700: "#333333",
    800: "#1A1A1A",
    900: "#0A0A0A",
    1000: "#000000",
  },
  primary: {
    50: "#FFF9C4",
    100: "#FFF59D",
    200: "#FFF176",
    300: "#FFEE58",
    400: "#FFEB3B",
    500: "#FDD835",
    600: "#FBC02D",
    700: "#F9A825",
    800: "#F57F17",
    900: "#F57F17",
  },
};

export const themeSettings = () => {
  return {
    palette: {
      mode: 'dark', // Always set mode to 'dark'
      primary: {
        dark: colorTokens.primary[800],
        main: colorTokens.primary[500],
        light: colorTokens.primary[50],
      },
      neutral: {
        dark: colorTokens.grey[100],
        main: colorTokens.grey[200],
        mediumMain: colorTokens.grey[300],
        medium: colorTokens.grey[400],
        light: colorTokens.grey[700],
      },
      background: {
        default: colorTokens.grey[900],
        alt: colorTokens.grey[800],
      },
    },
    typography: {
      fontFamily: ["Rubik", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Rubik", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
