import React from 'react'
import styles from '../../css/CheckOut.module.css'

const AddressSelect = (props) => {
  const { name, mobile, state, district, locality, pincode, landmark, type } = props.details
  return (
    <div className={styles['flexy']} style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", margin: "10px 0px 10px 0px" }}>
        <h4>{name.toUpperCase()}</h4>
        <p>{mobile}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", margin: "10px 0px 10px 0px" }}>
        <span style={{ display: "flex" }}><h4>{state.toUpperCase()}</h4>&nbsp;<p>{district.toUpperCase()}</p></span>
        <p style={{ fontSize: "small" }}>{locality}&#44;&nbsp;{pincode}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", margin: "10px 0px 10px 0px" }}>
        <h4>{landmark.toUpperCase()}</h4>
        <p style={{ fontSize: "small" }}>{type.toUpperCase()}</p>
      </div>
    </div>
  )
}

export default AddressSelect