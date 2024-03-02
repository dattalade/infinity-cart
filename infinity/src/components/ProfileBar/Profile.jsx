import React, { useEffect, useState } from 'react'
import SideBar from '../NavBars/SideBar'
import styles from '../../css/Profile.module.css'
import { Avatar, Button, CircularProgress, MenuItem, Select, TextField } from '@mui/material'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { createTheme, ThemeProvider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Cookies from 'universal-cookie'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const cookies = new Cookies();

const Profile = () => {

  const [userDetails, setUserDetails] = useState({})
  const [edit, setEdit] = useState({})
  const states_district = require('../../StatesAndDistricts/StateDistrict');
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");

  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {

    const getDetails = async () => {
      await axios.post("https://infinity-cart.onrender.com/getUserInfo", { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserDetails(response.data)
          setEdit(response.data);
          setState(response.data.state);
          setDistrict(response.data.district)
        }).catch(err => {
          console.log(err);
        });
      setLoading(false)
    }
    getDetails();
  }, [])

  const changeDate = (date) => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      dob: date ? date.toISOString() : ''
    }))
  }
  const changeValue = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    console.log(name + " " + value)
    setEdit((prevEdit) => ({
      ...prevEdit,
      [name]: value
    }))
    if (name === 'state') {
      setState(value)
      setDistrict("")
      setEdit((prevEdit) => ({
        ...prevEdit,
        district: ""
      }))
    }
    if (name === 'district')
      setDistrict(value);
  }

  const updateData = () => {
    console.log(edit)
    if (edit.name.length < 3) {
      toast.warn(`Name must be more than three characters`, {
        position: 'top-right',
        autoClose: 2000,
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
    else if (!(/[a-zA-Z]/.test(edit.name))) {
      toast.warn(`Name must contain alphabets [a-z][A-Z]`, {
        position: 'top-right',
        autoClose: 2000,
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
    else if (/\d/.test(edit.name)) {
      toast.warn(`Name must not contain numbers`, {
        position: 'top-right',
        autoClose: 2000,
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
    else if (!/^[a-zA-Z\s]+$/.test(edit.name)) {
      toast.warn(`Name must not conatain special characters`, {
        position: 'top-right',
        autoClose: 2000,
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
    else if (edit.district === "") {
      toast.warn(`Select your district belongs to ${edit.state}`, {
        position: 'top-right',
        autoClose: 2000,
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
    else {
      const update = async () => {
        await axios.post('https://infinity-cart.onrender.com/updateUserDetails', edit)
          .then((response) => {
            setUserDetails(response.data);
            setEdit(response.data);
            toast.success(`Details updated Successfully`, {
              position: 'top-right',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              style:
              {
                fontFamily: "'Noto Sans', sans-serif",
              },
            });
          }).catch(err => {
            console.log(err);
          });
      }
      update()
    }
  }

  if (userDetails._id === undefined) {
    nav('/');
  }
  else if (loading) {
    return (
      <>
        <div style={{ display: "flex" }}>
          <SideBar highlight="profile" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "17.5%", height: "90vh", width: "82.5%", padding: "5vh", overflow: "hidden" }}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }
  else {
    return (
      <ThemeProvider theme={theme}>

        <div style={{ display: "flex" }}>
          <SideBar highlight="profile" />
          <div style={{ marginLeft: "17.5%", height: "90vh", width: "82.5%", padding: "5vh", overflow: "hidden" }}>
            <div className={styles['profile']}>
              <div style={{ width: "96%", padding: "2%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar className={styles['hover-comp']} sx={{ width: 70, height: 70 }}> <CameraAltOutlinedIcon /> </Avatar>
                  </div>
                  <>&nbsp;</>
                  {/* <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Tooltip title="Change Picture">
                  <ModeEditOutlineOutlinedIcon className={styles['hover-comp']} />
                </Tooltip>
              </div> */}
                </div>
              </div>
              <div style={{ width: "96%", padding: "2%", display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
                <div className={styles.width}>
                  <TextField style={{ width: "100%" }}
                    InputProps={{ readOnly: true }} label="UserName" value={userDetails._id} variant='outlined' onChange={changeValue} focused required />
                </div>
                <div className={styles.width}>
                  <TextField className={styles['font']} style={{ width: "100%" }} label="Name" name='name' value={edit.name} variant='outlined' onChange={changeValue} focused={edit.name === "" ? false : true} required />
                </div>
                <div className={styles.width}>
                  <TextField style={{ width: "100%" }} InputProps={{ readOnly: true }} label="Email" value={userDetails.email} variant='outlined' focused />
                </div>
                <div className={styles.width}>
                  <TextField style={{ width: "100%" }} InputProps={{ readOnly: true }} label="Mobile" value={userDetails.mobile} variant='outlined' focused />
                </div>
                <div className={styles.width}>
                  <Select
                    value={state} name='state' onChange={changeValue} style={{ width: "100%" }}
                    required
                  >
                    {states_district.map((element, index) => (
                      element.state !== 'Select State' ?
                        <MenuItem key={index} value={element.state}>
                          <span>{element.state}</span>
                        </MenuItem> : null
                    ))}
                  </Select>
                </div>
                <div className={styles.width}>
                  {states_district.map((element, index) => (
                    element.state === edit.state ?
                      <Select value={district}
                        name='district'
                        onChange={changeValue}
                        style={{ width: "100%" }}
                        required
                      >
                        {element.districts.map((district, dist) => (
                          <MenuItem key={dist} value={district}>
                            {district !== "Select District" ? <span>{district}</span> : null}
                          </MenuItem>
                        ))}
                      </Select>
                      : null
                  ))}
                </div>
                <div className={styles.width}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      className={styles.widths}
                      label="Date of Birth"
                      name='dob'
                      onChange={changeDate}
                      value={dayjs(edit.dob !== undefined ? edit.dob : null)}
                    />
                  </LocalizationProvider>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", width: "96%", padding: "2%" }}>
                <Button onClick={updateData} style={{ width: "200px" }} variant='contained' color='error'><span>Save</span></Button>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </ThemeProvider>
    )
  }
}

export default Profile