import React from 'react'
import { motion } from 'framer-motion';
import styles from './LeftPart.module.css';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";

const LeftPart = () => {
  return (
    <>
      <div className={styles["left-part"]}>
        <div className={styles["intro-animation"]}>
          <div className={styles["navigate-back"]}>
            <Link to="/" style={{color : "red"}}><FaArrowLeft style={{position : "relative",top : "2.6px",}}/>&nbsp;&nbsp;Home</Link>
          </div>
          <div className={styles['circle-motion']}>
            <div className={styles['left-top-circle']}></div>
            <div className={styles['right-top-circle']}></div>
          </div>
          <div className={styles["intro-data"]}>
            <div>
              <motion.div className={styles["animation-container"]} initial={{ x: '-150%' }} animate={{ x: '-5%' }}  transition={{ duration: 1.5, ease: 'easeInOut' }}>
                <div style={{display : "flex"}}>
                  <h1 style={{color:"red"}}>|&nbsp;&nbsp;</h1>
                  <h1>Explore the Fashion</h1>
                </div>
              </motion.div>
            </div>
            <br />
            <div>
              <motion.div className={styles["animation-container"]} initial={{ x: '-150%' }} animate={{ x: '-5%' }}  transition={{ duration: 3.5, ease: 'easeInOut' }}>
                <div style={{display : "flex"}}>
                  <h1 style={{color:"black"}}>|&nbsp;&nbsp;</h1>
                  <h1 style={{color: "red"}}>Infinity Cart</h1>
                </div>
              </motion.div>
            </div>
          </div>
          <div className={styles['circle-motion']}>
            <div className={styles['left-bottom-circle']}></div>
            <div className={styles['right-bottom-circle']}></div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LeftPart