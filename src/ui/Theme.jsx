import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const createTheme = () => createMuiTheme({
  palette: {
    background: {
      default: '#e8f0f4',
      paper: '#fff',
    },
    primary: {
      main: '#455A64',
      light: 'rgb(106, 123, 131)',
      dark: 'rgb(48, 62, 70)',
      contrastText: '#fff',
    },
    secondary: {
      main: '#D84315',
      light: 'rgb(223, 104, 67)',
      dark: 'rgb(151, 46, 14)',
      contrastText: '#fff',
    },
    error: {
      light: '#e57373',
      main: '#f44336',
      dark: '#d32f2f',
      contrastText: '#fff',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

const Theme = ({ children }) => (
  <MuiThemeProvider theme={createTheme()}>
    {children}
  </MuiThemeProvider>
);

export default Theme;
