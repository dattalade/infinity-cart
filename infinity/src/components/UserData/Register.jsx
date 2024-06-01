import axios from 'axios';
import React, { useState } from 'react';
import styles from '../../css/Register.module.css';
import LeftPart from '../../components/WelcomeAnimation/LeftPart';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(
    {
      name: '',
      email: '',
      dob: '',
      mobile: '',
      state: 'Select State',
      district: 'Select District',
      password: '',
      repassword: ''
    });

  const [inputType, setInputType] = useState('password');

  const states_district = require('../../StatesAndDistricts/StateDistrict');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const showChange = () => {
    setInputType(inputType === 'text' ? 'password' : 'text');
  }

  const storeData = async (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('https://infinity-cart.onrender.com/register', formData).then((response) => {
      if (response.data.message !== '' && response.data.type !== '' && response.data.type !== "Verify" && response.data.type !== 'Registration') {
        toast.warn(`${response.data.type} ${response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
          },
        });
      }
      if (response.data.type === "Verify") {
        toast.info(`${response.data.type} ${response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
          },
        });
      }

      if (response.data.type === "Registration") {
        toast.success(`${response.data.type} ${response.data.message}`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
          },
        });
      }
      setLoading(false);
    }).catch(err => {
      console.log(err);
      setLoading(false);
    });
  }

  return (
    <React.Fragment>
      <div className={styles["register-page"]}>
        <LeftPart />
        <div className={styles['right-part']}>
          <div className={styles['register-part']}>
            <div className={styles['register-heading']}>
              <h1>Register&nbsp;<span style={{ color: "red" }}>Cart</span></h1>
            </div>
            <div className={styles['register-content']}>
              <div className={styles['register-div']}>
                <form className={styles['register-form']} onSubmit={storeData}>

                  <input type='text' name='name' onChange={handleChange} className={styles['login-name']} placeholder='Full Name' required />
                  <input type='email' name='email' onChange={handleChange} className={styles['login-mail']} placeholder='Personal Mail' required />

                  <input type='date' name='dob' onChange={handleChange} className={styles['login-dob']} placeholder='Date' required />
                  <input type='number' name='mobile' onChange={handleChange} className={styles['login-mobile']} placeholder='Phone Number' required />
                  <select name='state' onChange={handleChange} className={styles['login-state']}>
                    {states_district.map((option, index) => (
                      <option key={index}>
                        {option.state}
                      </option>
                    ))}
                  </select>

                  <select name='district' onChange={handleChange} className={styles['login-district']}>
                    {states_district.map((options, indexOptions) => (
                      <React.Fragment key={indexOptions}>
                        {options.districts.map((district, indexDistrict) => (
                          formData.state === options.state ?
                            <React.Fragment key={indexDistrict}>
                              <option>
                                {district}
                              </option>
                            </React.Fragment> : <React.Fragment key={indexDistrict}>
                            </React.Fragment>
                        ))}
                      </React.Fragment>
                    ))}
                  </select>

                  <input type={inputType} name='password' className={styles['login-password']} onChange={handleChange} placeholder='Password' required />
                  <input type={inputType} name='repassword' className={styles['login-repassword']} onChange={handleChange} placeholder='Re-Enter Password' required />

                  <span className={styles['login-checkbox']}>
                    <input type="checkbox" className={styles['input-showpass']} onChange={showChange} />
                    <label className={styles['label-showpass']}>Show Password</label>
                  </span>
                  <span className={styles['login-dummy']} style={{ visibility: "hidden" }}>
                    Hide
                  </span>
                  {loading ?
                    <>
                      <button className={styles['register-button']} style={{ background: "gainsboro", cursor: "default" }} disabled>Loading ...</button>
                    </> :
                    <>
                      <button className={styles['register-button']}>Up&nbsp;Cart&nbsp;&nbsp;&nbsp;</button>
                    </>
                  }
                  <h6>
                    <span className={styles['not-have']}>Already have an account?</span>
                    <Link to="/login" className={styles['incart']}>Login</Link>
                  </h6>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default Register;
