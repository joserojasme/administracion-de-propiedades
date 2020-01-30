import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography:{
    fontFamily:'Poppins', 
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#92C63E',
      main: '#111',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#FF6B0B',
      dark: '#ba000d',
      contrastText: '#fff',
    },
  },
  status: {
    danger: 'orange',
  },
});

export default theme;