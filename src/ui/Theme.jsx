import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';

const createTheme = () => createMuiTheme({
  palette: {
    primary: purple,
    secondary: green,
  },
  status: {
    danger: 'orange',
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
