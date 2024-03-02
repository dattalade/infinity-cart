import React from 'react'
import SideBar from '../NavBars/SideBar'
import styles from '../../css/Coupons.module.css'

const Coupons = () => {

  return (
    <div style={{ display: "flex" }}>
      <SideBar highlight="coupons" />
      <div style={{ marginLeft: "17.5%", height: "90vh", width: "82.5%", padding: "5vh", overflow: "hidden" }}>
        <div className={styles['profile']}>
          <h1 style={{ padding: "2%" }}>Coupons</h1>
        </div>
      </div>
    </div>
  )
}


export default Coupons