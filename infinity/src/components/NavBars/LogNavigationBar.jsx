import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from '../../css/LogNavigationBar.module.css';
import { IoIosArrowDown } from "react-icons/io";
import PersonIcon from '@mui/icons-material/Person';
import { Badge } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Cookies from 'universal-cookie';
const cookie = new Cookies();

const LogNavigationBar = (props) => {
  var logoStyle =
  {
    position: "relative",
    top: "12%"
  }

  var signStyle =
  {
    position: "relative",
    top: "5px"
  }

  const [activeLink, setActiveLink] = useState(() => {
    if (props.link !== undefined || props.link !== null)
      return props.link
    return 'home';
  });

  const logOut = () => {
    cookie.remove('token')
    window.location.assign("/")
  }

  return (
    <header className={styles["laptop_navigation"]}>
      {/*Top Navigation */}
      <div>
        <div className={styles["top_nav"]} id="top_nav">
          <p className={styles["shipping"]} id="shipping">Free Shipping on all orders above &#8377;1499</p>
          <ul className={styles["account_menu"]} id="account_menu">
            <li className={styles["account"]} id="account">
              <Link className={styles["a_account"]} id="a_account" to="/">My Account<IoIosArrowDown style={logoStyle} /></Link>
              <div>
                <ul className={styles["account_selection"]} id="account_selection">
                  <li><Link to="/profile" className={styles["sign-in"]}><PersonIcon style={signStyle} />Your&nbsp;Profile</Link></li>
                  <li><Link to="" onClick={logOut} className={styles["register"]}><LogoutSharpIcon style={signStyle} />&nbsp;Logout</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/*Bottom Navigation */}
      <div>
        <div className={styles["bottom_nav"]} id="bottom_nav">
          <div className={styles["logo"]} style={{ display: "flex", alignItems: "center" }}>
            {/* <img src='https://res.cloudinary.com/db8wetftg/image/upload/v1708709252/logo/infinity-logo.png' alt='no' style={{width: "50px"}} /> */}
            <Link to="/">
              <p className={styles["title"]}>
                <span className={styles["infinity"]}>Infinity</span>
                <span className={styles["cart"]}>Cart</span>
              </p>
            </Link>
          </div>
          <ul className={styles["item_types"]}>
            <li>
              <Link to="/" className={activeLink === 'home' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('home')}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/men" className={activeLink === 'men' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('men')}>
                Men
              </Link>
            </li>
            <li>
              <Link to="/kids" className={activeLink === 'kids' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('kids')}>
                Kids
              </Link>
            </li>
            <li>
              <Link to="/accessories" className={activeLink === 'accessories' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('accessories')}>
                Accessories
              </Link>
            </li>
            <li>
              <Link to="/footwear" className={activeLink === 'footwear' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('footwear')}>
                Footwear
              </Link>
            </li>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <li>
                <Link to="/myCart" className={activeLink === 'cart' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('cart')}>
                  <span>My&nbsp;Cart&nbsp;</span>
                </Link>
              </li>
              <Link to="/myCart">
                <Badge badgeContent={props.cartSize} color="error" max={9}>
                  <ShoppingCartOutlinedIcon className={styles['no-underline']} fontSize='medium' />
                </Badge>
              </Link>
            </div>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default LogNavigationBar;