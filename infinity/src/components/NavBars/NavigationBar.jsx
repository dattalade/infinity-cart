import React, { useEffect, useMemo, useState } from 'react'
import Cookies from 'universal-cookie';
import UnLogNavigationBar from './UnLogNavigationBar';
import LogNavigationBar from './LogNavigationBar';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
const cookie = new Cookies();

const NavigationBar = (props) => {
  const [cartSize, setCartSize] = useState(0);
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });
  useEffect(() => {
    axios.post("https://infinitycart.onrender.com/getUserItems", { jwtToken: cookie.get('token') }).then((response) => {
      setCartSize(response.data.usercartItems.length);
    })
      .catch(err => {
        console.log(err);
      });
  })

  const cookies = useMemo(() => {
    return cookie.get('token')
  }, [])

  if (cookies === undefined) {
    return (
      <>
        <ThemeProvider theme={theme}>
          <UnLogNavigationBar link={props.link} />
        </ThemeProvider>
      </>
    );
  }
  // cookie.remove('token')
  return (
    <>
      <ThemeProvider theme={theme}>
        <LogNavigationBar link={props.link} cartSize={cartSize} />
      </ThemeProvider>
    </>
  );
}

export default NavigationBar;