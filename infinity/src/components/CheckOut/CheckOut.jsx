import React, { useEffect, useState } from 'react'
import styles from '../../css/CheckOut.module.css'
import NavigationBar from '../NavBars/NavigationBar'
import { ToastContainer, toast } from 'react-toastify'
import { Button, CircularProgress, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import Cookies from 'universal-cookie'
import AddressSelect from './AddressSelect'
import { useNavigate } from 'react-router-dom'
const cookies = new Cookies();

const CheckOut = () => {

  const [loading, setLoading] = useState(true)
  const nav = useNavigate();

  const [pincodeLocality, setPincodeLocality] = useState([])
  const [local, setLocal] = useState("")
  const [state, setState] = useState("")
  const [district, setDistrict] = useState("")
  const [paymentType, setPaymentType] = useState("")
  const [deliveryData, setDeliveryData] = useState
    ({
      name: "",
      mobile: 0,
      pincode: 0,
      locality: "",
      landmark: "",
      state: "",
      district: "",
      type: ""
    })

  const [userAddress, setUserAddress] = useState
    ({
      userId: null,
      address: []
    })
  const [selectedAddress, setSelectedAddress] = useState()
  const [cost, setCost] = useState({
    totalCost: 0,
    payCost: 0,
    shippingCost: 0
  })

  useEffect(() => {
    const getUserAddress = async () => {
      await axios.post('https://infinity-cart.onrender.com/getUserAddress', { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserAddress(prevAddress => ({
            ...prevAddress,
            userId: response.data.userId,
            address: response.data.address
          }))
        }).catch(err => {
          console.log(err);
        });
      await axios.post('https://infinity-cart.onrender.com/getCartInfo', { jwtToken: cookies.get('token') })
        .then((response) => {
          if (response.data.usercartItems.length === 0)
            nav('/myCart')
          setCost(prevCost => ({
            ...prevCost,
            totalCost: response.data.totalMRP,
            payCost: response.data.discountMRP,
            shippingCost: response.data.discountMRP > 1499 ? 0 : 89
          }))
        }).catch(err => {
          console.log(err);
        });
      setLoading(false)
    }
    getUserAddress();
  }, [nav])

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target
    setDeliveryData(prevDelivery => ({
      ...prevDelivery,
      [name]: value
    }));

    if (name === 'pincode') {
      const getData = async () => {
        setPincodeLocality([]);
        setState("")
        setDistrict("")
        const response = await axios.get(`https://api.postalpincode.in/pincode/${value}`);
        if (response.data[0].PostOffice !== undefined && response.data[0].PostOffice !== null) {
          setPincodeLocality(() => {
            return response.data[0].PostOffice
          })
          setDeliveryData(prevDelivery => ({
            ...prevDelivery,
            state: response.data[0].PostOffice[0].Circle,
            district: response.data[0].PostOffice[0].District
          }));
          setState(response.data[0].PostOffice[0].Circle)
          setDistrict(response.data[0].PostOffice[0].District)
        }
      }
      getData();
    }
    else if (name === 'locality') {
      setLocal(value);
    }
  }

  const saveNewAddress = () => {
    if (deliveryData.name.length === 0) {
      toast.warn("Name must not be empty",
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
    }
    else if (deliveryData.name.length < 3) {
      toast.warn("Name must contain more than 3 characters",
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
        });
    }
    else if (!(/[a-zA-Z]/.test(deliveryData.name))) {
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
    else if (/\d/.test(deliveryData.name)) {
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
    else if (!/^[a-zA-Z\s]+$/.test(deliveryData.name)) {
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
    else if (deliveryData.mobile <= 0) {
      toast.warn(`Mobile number must be +ve`, {
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
    else if (JSON.stringify(deliveryData.mobile).length < 10) {
      toast.warn(`Mobile number must be 10 digit`, {
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
    else if (deliveryData.pincode === 0 || (pincodeLocality === null && pincodeLocality === undefined)) {
      toast.warn(`Enter correct Pincode`, {
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
    else if (deliveryData.landmark.length === 0) {
      toast.warn(`Landmark is required`, {
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
    else if (deliveryData.type !== 'work' && deliveryData.type !== 'home') {
      toast.warn(`Select the delivery type`, {
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
      const addData = async () => {
        await axios.post('https://infinity-cart.onrender.com/addAddress', { deliveryData: deliveryData, userId: userAddress.userId })
          .then((response) => {
            setUserAddress(prevAddress => ({
              ...prevAddress,
              address: response.data.address
            }))
            toast.success(`Address saved successfully`, {
              position: 'top-center',
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
      addData()
    }
  }

  const placingOrder = () => {
    console.log(paymentType)
    if (userAddress.address.length === undefined) {
      toast.warn(`Link your Address`, {
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
    else if (selectedAddress === undefined) {
      toast.warn(`Select any address for your delivery`, {
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
    else if (paymentType.length === 0) {
      toast.warn(`Select Payment type`, {
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
      if (paymentType === 'cash') {
        const addOrder = async () => {
          await axios.post('https://infinity-cart.onrender.com/placecashorder', { userId: userAddress.userId, addressId: selectedAddress, costDetails: cost, paymentType: paymentType })
            .then((response) => {
              nav(`/order-placed?order-id=${response.data.orderId}`)
            })
            .catch(err => {
              console.log(err);
            });
        }
        addOrder();
      }
      else {
        const addOrder = async () => {
          const response = await axios.post('https://infinity-cart.onrender.com/create-order', { amount: cost.payCost + cost.shippingCost })
          const { data } = response
          const prefills = await axios.post('https://infinity-cart.onrender.com/get-checkout-details', { userId: userAddress.userId, addressId: selectedAddress })
          console.log(response.data)
          const options = {
            key: 'rzp_test_byEpIl0N6kfEaV', // Your Razorpay Key ID
            amount: data.amount, // Same as the amount used while creating the order
            currency: 'INR',
            name: 'INFINITY CART',
            description: 'Payment Gateway',
            image: 'https://res.cloudinary.com/db8wetftg/image/upload/v1708709252/logo/infinity-logo.png',
            order_id: data.id,
            handler: async (response) => {
              await axios.post("https://infinity-cart.onrender.com/payment-verification",
                {
                  razorpay_signature: response.razorpay_signature, razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id, userId: userAddress.userId, addressId: selectedAddress,
                  costDetails: cost, paymentType: paymentType
                })
                .then((response) => {
                  if (response.data.success) {
                    nav(`/order-placed?payment-id=${response.data.paymentId}`)
                  }
                  else {
                    nav(`/error-page`)
                  }
                })
                .catch(err => {
                  console.log(err);
                });
              console.log(response.razorpay_signature)
            },
            prefill: {
              name: prefills.data.name,
              email: prefills.data.email,
              contact: prefills.data.mobile
            },
            notes: {
              address: 'E-commerce Office'
            },
            theme: {
              color: '#FF0000',
            },
          };
          const razor = new window.Razorpay(options);
          razor.open();
        }
        addOrder();
      }
    }
  }

  const changeAddress = (addressId) => {
    setSelectedAddress(addressId)
  }

  if (userAddress.userId === null) {
    nav('/login')
  }
  else if (loading) {
    return (
      <>
        <NavigationBar link="cart" />
        <div style={{ paddingTop: '120px' }}>
          <div className={styles['loading-progress']}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }
  else {
    return (
      <>
        <NavigationBar link="cart" />
        <ThemeProvider theme={theme}>
          <div className={styles['checkout-page']}>
            <div className={styles['left-panel']}>
              <div className={styles['newaddress']}>
                <h3>Delivery&nbsp;Address</h3>
                <form className={styles['form']}>
                  <div className={styles['two']}>
                    <TextField onChange={handleChange} color='error' name='name' size='small' label="Name" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                    <TextField onChange={handleChange} color='error' type='number' name='mobile' size='small' label="Mobile" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                    <TextField onChange={handleChange} color='error' type='number' size='small' name='pincode' label="Pincode" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                    <Select color='error' size='small' label="Locality" name='locality'
                      style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} value={local}
                      onChange={handleChange}
                    >
                      {(pincodeLocality !== null) ? pincodeLocality.map((element, index) =>
                        <MenuItem key={index} value={element.Name}>
                          {element.Name}
                        </MenuItem>
                      ) : null}
                    </Select>
                    <TextField value={state} onChange={handleChange} color='error' size='small' name='state' label="State" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                    <TextField value={district} onChange={handleChange} color='error' size='small' name='district' label="District" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                    <TextField onChange={handleChange} color='error' name='landmark' size='small' label="Landmark" style={{ width: "300px", marginBottom: "20px", marginRight: "10px" }} />
                  </div>
                  <RadioGroup onChange={handleChange} name='type' sx={{ display: "grid", gridTemplateColumns: "auto auto", justifyContent: "space-around" }}>
                    <FormControlLabel value="work" control={<Radio color='error' size='small' />} label='Work' />
                    <FormControlLabel value="home" control={<Radio color='error' size='small' />} label='Home' />
                  </RadioGroup>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Button onClick={saveNewAddress} color='error' variant='contained'><h3>SAVE</h3></Button>
                  </div>
                </form>
              </div>
              <div className={styles['available']}>
                {userAddress.address.length === 0 ? null :
                  <div style={{ marginBottom: "20px" }}>
                    <h2>Address</h2>
                  </div>
                }
                <RadioGroup>
                  {userAddress.address !== undefined ?
                    userAddress.address.map((element, index) =>
                      <React.Fragment key={index}>
                        <div className={styles['address']}>
                          <Radio color='error' onChange={() => changeAddress(element._id)}
                            checked={selectedAddress === undefined ? false : (selectedAddress === element._id ? true : false)}
                          />
                          <AddressSelect details={element} />
                        </div>
                      </React.Fragment>
                    )
                    : null}
                </RadioGroup>
              </div>
              <div>
                <h2 style={{ marginBottom: "10px" }}>Payment Type</h2>
                <RadioGroup onChange={(e) => setPaymentType(e.target.value)} name='type'>
                  <FormControlLabel value="cash" control={<Radio color='error' size='small' />} label='Pay on Delivery' />
                  <FormControlLabel value="bank" control={<Radio color='error' size='small' />} label='Pay Online' />
                </RadioGroup>
              </div>
            </div>
            <div className={styles['right-panel']}>
              <div style={{ marginBottom: "10px", width: "25%" }}>
                <span style={{ display: "flex" }}>
                  <h3>Total&nbsp;Cost&nbsp;</h3>
                  <p>(&#8377;{cost.payCost + cost.shippingCost})</p>
                </span>
                <div style={{ display: "flex", width: "100%" }}>
                  <p>Shipping&nbsp;</p>
                  {cost.shippingCost > 0 ? <p style={{ color: "teal" }}>&#8377;{cost.shippingCost}</p> : <p style={{ color: "green" }}>FREE</p>}
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <Button onClick={placingOrder} variant='contained' color='error' sx={{ width: "40%" }}><h4>Place&nbsp;Order</h4></Button>
              </div>
            </div>
          </div>
        </ThemeProvider>
        <ToastContainer />
      </>
    )
  }
}

export default CheckOut