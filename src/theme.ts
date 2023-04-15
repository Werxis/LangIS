import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    tercial: Palette['primary'];
  }

  interface PaletteOptions {
    tercial: PaletteOptions['primary'];
  }
}

// https://mui.com/material-ui/customization/theming/
const theme = createTheme({
  palette: {
    primary: {
      // light, dark, contrastText will be auto-calculated from main
      main: '#1976d2',
    },
    secondary: {
      // light, dark, contrastText will be auto-calculated from main
      main: '#9c27b0',
    },
    // When declaring new custom color, provide all variants as light, main, dark, contrastText
    tercial: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    mode: 'light',
  },
  typography: {
    fontFamily: 'Roboto',
  },
});

export default theme;
