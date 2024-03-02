import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import styles from '../../css/UnLogNavigationBar.module.css';
import { IoIosArrowDown } from "react-icons/io";
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UnLogNavigationBar = (props) => {
  var logoStyle = {
    position: "absolute",
    top: "12%"
  }

  var signStyle =
  {
    position: "relative",
    top: "5px"
  }

  const [activeLink, setActiveLink] = useState(() => {
    if (props.link)
      return props.link
    // Get the active item from localStorage, default to 'home' if not found
    return 'home';
  });

  return (
    <header className={styles["laptop_navigation"]}>
      {/*Top Navigation */}
      <div>
        <div className={styles["top_nav"]} id="top_nav">
          <p className={styles["shipping"]} id="shipping">Free Shipping on all orders above &#8377;1499</p>
          <ul className={styles["account_menu"]} id="account_menu">
            <li className={styles["account"]} id="account">
              <Link className={styles["a_account"]} id="a_account" to="/">My Account<IoIosArrowDown style={logoStyle} /></Link>
              <div class={styles["make_visible"]}>
                <ul className={styles["account_selection"]} id="account_selection">
                  <li><Link to="/login" className={styles["sign-in"]}><PersonIcon style={signStyle} />Sign In</Link></li>
                  <li><Link to="/add-user" className={styles["register"]}><PersonAddIcon style={signStyle} />&nbsp;Register</Link></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/*Bottom Navigation */}
      <div>
        <div className={styles["bottom_nav"]} id="bottom_nav">
          <div className={styles["logo"]}>
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
            <li>
              <Link to="/help" className={activeLink === 'help' ? styles['activeLink'] : styles['bottom_element']} onClick={() => setActiveLink('customer care')}>
                Customer&nbsp;Care
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default UnLogNavigationBar;