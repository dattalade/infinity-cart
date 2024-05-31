import React, { useState } from 'react';
import styles from '../../css/Login.module.css';
import LeftPart from '../../components/WelcomeAnimation/LeftPart';
import { ToastContainer, toast } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material';
// import { createTheme, IconButton, InputAdornment, OutlinedInput, ThemeProvider } from '@mui/material';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Cookies from 'universal-cookie';
import 'react-toastify/dist/ReactToastify.css';
import { Checkbox, FormControlLabel, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const cookies = new Cookies();

const Login = () => {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('password');
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });
  const [formData, setFormData] = useState
    ({
      email: '',
      password: '',
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showChange = () => {
    setInputType(inputType === 'text' ? 'password' : 'text');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios.post('https://infinity-cart.onrender.com/login', formData,
      // { 
      // headers: {
      //   'Access-Control-Allow-Origin': 'https://infinity-cart.vercel.app/',
      //   'Access-Control-Allow-Methods': 'POST',
      //   'Content-Type': 'application/json'
      // }}
    ).then((response) => {
      if (response.data.type !== 'Login') {
        toast.warn(`${response.data.type} ${response.data.message}`,
          {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            style:
            {
              fontFamily: "'Noto Sans', sans-serif",
            },
          });
      }
      else {
        cookies.set('token', response.data.token, { httpOnly: true, secure: true, sameSite: 'strict' })
        toast.success(`${response.data.type} ${response.data.message}`,
          {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            style:
            {
              fontFamily: "'Noto Sans', sans-serif"
            },
            onOpen: () => {
              setTimeout(() => {
                nav('/home');
              }, 3000);
            },
            onClose: () => {
              clearTimeout();
            }
          });
      }
      setLoading(false);
    }).catch(err => {
      console.log(err);
    });
    setLoading(false);
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <div className={styles["login-page"]}>
          <LeftPart />
          <div className={styles['right-part']}>
            <div className={styles['login-part']}>
              <div className={styles['login-heading']}>
                <h1>Login&nbsp;<span style={{ color: "red" }}>Cart</span></h1>
              </div>
              <div className={styles['login-content']}>
                <div className={styles['login-div']}>
                  <form className={styles['login-form']} onSubmit={handleLogin}>
                    <input type="email" name='email' className={styles['login-mail']} onChange={handleChange} placeholder='Email' required />
                    {/* <OutlinedInput sx={{height: "50px"}}
                      type={inputType}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={showChange}
                            edge="end"
                          >
                            {inputType === 'password' ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />                     */}
                    <input type={inputType} name='password' className={styles['login-password']} onChange={handleChange} placeholder='Password' required />
                    <FormControlLabel onChange={showChange} className={styles['input-showpass']} control={<Checkbox />} label={<Typography>Show Password</Typography>} /><br />
                    {loading ?
                      <>
                        <button className={styles['login-button']} style={{ background: "gainsboro", cursor: "default" }} disabled>Loading ...</button>
                      </> :
                      <>
                        <button className={styles['login-button']}>In&nbsp;Cart&nbsp;&nbsp;&nbsp;</button>
                      </>
                    }
                    <h4 className={styles['reg-not']}>
                      <span className={styles['not-have']}>Don't have an account?&nbsp;</span>
                      <Link to="/add-user" className={styles['incart']}>Register</Link>
                    </h4>
                    <h5 className={styles['reg-not']}>
                      <span className={styles['not-have']}>Forgot Password?&nbsp;</span>
                      <Link to="/reset" className={styles['forgot']}>Reset&nbsp;Password</Link>
                    </h5>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </ThemeProvider>
    </>
  );
};


export default Login;
