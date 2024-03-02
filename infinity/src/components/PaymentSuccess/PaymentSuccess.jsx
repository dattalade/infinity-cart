import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import Lottie from 'lottie-react';
import { createTheme, ThemeProvider } from '@mui/material';
import successData from '../../lotties/success.json'
import Cookies from 'universal-cookie';
const cookies = new Cookies();

const PaymentSuccess = () => {
  const searchQuery = useSearchParams()[0];
  const paymentId = searchQuery.get('payment-id')
  const orderId = searchQuery.get('order-id');

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });
  // console.log(paymentId)

  if (paymentId !== null) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Lottie
            animationData={successData}
            loop
            autoplay
            style={{ width: 300, height: 300 }} // Set width and height as per your requirement
          />
          <h3>Your&nbsp;order&nbsp;is&nbsp;successfully&nbsp;placed</h3>
        </div>
      </ThemeProvider>
    )
  }
  else if (orderId !== null) {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <Lottie
            animationData={successData}
            loop
            autoplay
            style={{ width: 300, height: 300 }} // Set width and height as per your requirement
          />
          <h3>Your&nbsp;order&nbsp;is&nbsp;successfully&nbsp;placed</h3>
        </div>
      </ThemeProvider>
    )
  }
  else if (cookies.get('token') === undefined) {
    return (
      <Navigate to="/login" />
    )
  }
  else {
    return (
      <Navigate to="/" />
    )
  }
}

export default PaymentSuccess;