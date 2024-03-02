import React, { useEffect, useState } from 'react'
import styles from '../../css/SideBar.module.css';
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Cookies from 'universal-cookie'
import axios from "axios"
const cookies = new Cookies();

const SideBar = (props) => {
  const [userName, setUserName] = useState("");
  const token = cookies.get('token')
  useEffect(() => {
    const getDetails = async () => {
      await axios.post("https://infinitycart.onrender.com/getUserInfo", { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserName(response.data.name)
        }).catch(err => {
          console.log(err);
        });
    }

    getDetails();
  }, [token])
  return (
    <>
      <div className={styles['sidebar']}>
        <div className={styles['sidebar-content']}>
          <div style={{
            width: "100%", padding: "20% 0% 20% 0%", display: "flex", justifyContent: "center", alignItems: "center",
            height: "10%",
          }}
          >
            <Avatar sx={{ backgroundColor: "red", width: 60, height: 60 }}>{userName.substring(0, 1)}</Avatar>
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-evenly", height: "80%" }}>
            <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
              <Link to='/' style={{ color: "whitesmoke", display: "flex", flexWrap: "wrap" }}>
                <ArrowBackIcon fontSize='small' />&nbsp;
                <span>Back&nbsp;to&nbsp;Home</span>
              </Link>
              <hr />
            </div>
            <div style={{ padding: "25%", display: "flex", justifyContent: "center" }}>
              <Link to='/profile'
                className={props.highlight !== "profile" ? styles.a : styles['highlight']}
              >
                <span>Profile</span>
              </Link>
            </div>
            <div style={{ padding: "25%", display: "flex", justifyContent: "center" }}>
              <Link to='/profile/wishlist'
                className={props.highlight !== "wishlist" ? styles.a : styles['highlight']}
              >
                <span>Wishlists</span>
              </Link>
            </div>
            <div style={{ padding: "25%", display: "flex", justifyContent: "center" }}>
              <Link to='/profile/orders'
                className={props.highlight !== "orders" ? styles.a : styles['highlight']}
              >
                <span>Orders</span>
              </Link>
            </div>
            <div style={{ padding: "25%", display: "flex", justifyContent: "center" }}>
              <Link to='/profile/coupons'
                className={props.highlight !== "coupons" ? styles["a"] : styles['highlight']}
              >
                <span>Coupons</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SideBar