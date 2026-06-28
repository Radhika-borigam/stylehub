import { createTheme } from "@mui/material";

const flipkartTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7c3aed", // Modern Violet
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f43f5e", // Modern Rose
      contrastText: "#ffffff",
    },
    background: {
      default: "#f8f6ff",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e1b4b", // Deep indigo text
      secondary: "#6b7280", // Slate-500
    },
  },
  typography: {
    fontFamily: "'Inter', 'Outfit', 'Roboto', sans-serif",
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "none",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
          },
        },
        containedPrimary: {
          backgroundColor: "#7c3aed",
          "&:hover": {
            backgroundColor: "#6d28d9",
          },
        },
        containedSecondary: {
          backgroundColor: "#f43f5e",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#e11d48",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
});

export default flipkartTheme;
