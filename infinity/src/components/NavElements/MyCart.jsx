import styles from '../../css/MyCart.module.css'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import NavigationBar from '../NavBars/NavigationBar'
import CardMedia from '@mui/material/CardMedia';
import Cookies from 'universal-cookie'
import { Button, CardContent, Checkbox, IconButton, Tooltip } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { MinusCircleFilled, PlusCircleFilled } from '@ant-design/icons';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { Link, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cookies = new Cookies();

const MyCart = () => {

  const nav = useNavigate();
  const [usercart, setUsercart] = useState
    ({
      userId: null,
      usercartItems: [],
      totalMRP: 0,
      discountMRP: 0
    })

  const [loading, setLoading] = useState(true)
  const theme = createTheme({
    typography: {
      fontFamily: [
        'Poppins',
        'sans-serif',
      ].join(','),
    },
  });

  useEffect(() => {
    const getAll = async () => {
      await axios.post("https://infinity-cart.onrender.com/getCartInfo", { jwtToken: cookies.get('token') }).then((response) => {
        setUsercart(prevusercart => ({
          ...prevusercart,
          userId: response.data.userId,
          usercartItems: response.data.usercartItems,
          totalMRP: response.data.totalMRP,
          discountMRP: response.data.discountMRP
        }));
      }).catch(err => {
        console.log(err);
      });
      setLoading(false);
    }
    getAll();
  }, [])

  const saveQuantity = (index, id, operation) => {
    const getCart = async () => {
      await axios.post("https://infinity-cart.onrender.com/updateQuantity", { userId: usercart.userId, itemId: id, updatedQuantity: operation, index: index }).then((response) => {
        setUsercart(prevUsercart => {
          const newUserCart = { ...prevUsercart };
          const newUserCartItems = [...prevUsercart.usercartItems];
          newUserCartItems[index].quantity = response.data.quantity;
          newUserCart.usercartItems = newUserCartItems;
          let tm = 0, dm = 0;
          for (let i = 0; i < newUserCartItems.length; i++) {
            tm += (newUserCartItems[i].quantity * newUserCartItems[i].productDetails.originalPrice);
            dm += (newUserCartItems[i].quantity * newUserCartItems[i].productDetails.discountPrice);
          }
          newUserCart.totalMRP = tm;
          newUserCart.discountMRP = dm;
          return newUserCart;
        });
      }).catch(err => {
        console.log(err);
      });
    }
    getCart();
  }

  const removeItem = (itemId, selectedSize) => {
    const getCart = async () => {
      await axios.post("https://infinity-cart.onrender.com/removeItem", { userId: usercart.userId, itemId: itemId, size: selectedSize }).then((response) => {
        setUsercart(prevusercart => ({
          ...prevusercart,
          usercartItems: response.data.usercartItems,
        }));
        if (response.data.usercartItems.length >= 1)
          window.location.reload()
      }).catch(err => {
        console.log(err);
      });
    }
    getCart();
  }

  const moveWishlist = (itemId) => {
    console.log(itemId)
  }

  if (loading) {
    return (
      <>
        <NavigationBar link="cart" />
        <div style={{ paddingTop: '10%' }}>
          <div className={styles['loading-progress']}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }
  else if (usercart.usercartItems.length > 0) {
    return (
      <>
        <NavigationBar link="cart" />
        <ThemeProvider theme={theme}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%", paddingTop: "180px" }}>
            <div className={styles['cart']} style={{ width: "35%", height: "fit-content" }}>
              {usercart.usercartItems.map((item, index) => (
                <React.Fragment key={index}>
                  <div style={{ width: "100%", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", borderRadius: "15px" }}>
                    <Card
                      sx={{ display: 'flex', flexWrap: "wrap", width: "100%", justifyContent: "space-between", boxShadow: "none" }}
                      style={{ borderRadius: "15px" }}
                    >
                      <div style={{ display: "flex", width: "100%", padding: "1%" }}>
                        <CardMedia
                          component="img"
                          sx={{ width: "20%", cursor: "pointer", height: "100%" }}
                          style={{ borderRadius: "15px", width: "20%" }}
                          image={`${item.productDetails.image}`}
                          onClick={() => nav(`/productdetails?apparel=${item.productDetails.apparel}&id=${item.productDetails._id}`)}
                          alt="No image"
                        />
                        <CardContent style={{ paddingTop: "0", width: "40%", paddingBottom: "0", display: "flex" }}>
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }} className={styles['font']}>
                            <div>
                              <h3>{item.productDetails.displayName}</h3>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "75%" }}>
                              <p>
                                <span>Quantity:&nbsp;{item.quantity}</span>
                                <div>
                                  <PlusCircleFilled
                                    style={{ color: item.quantity === item.productDetails.sizeData.find((sele) => sele.size === item.size).quantity ? "lightgray" : "red" }}
                                    className={item.productDetails.sizeData.find((sele) => sele.size === item.size).quantity > item.quantity ? styles['hover'] : null}
                                    onClick={item.productDetails.sizeData.find((sele) => sele.size === item.size).quantity > item.quantity ? () => saveQuantity(index, item.productDetails._id, "+") : null}
                                  />
                                  <span>&nbsp;</span>
                                  <MinusCircleFilled
                                    onClick={item.quantity > 1 ? () => saveQuantity(index, item.productDetails._id, "-") : null}
                                    className={item.quantity > 1 ? styles['hover'] : null} style={{ color: item.quantity === 1 ? "lightgray" : "red" }}
                                  />
                                </div>
                              </p>

                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "75%" }}>
                              <p>Size:&nbsp;<span style={{ fontWeight: "bold" }}>{item.size === undefined ? "One Size" : item.size}</span></p>

                            </div>
                            <p style={{ display: "flex", justifyContent: "space-between" }}>
                              <h4>&#8377;&nbsp;{item.productDetails.discountPrice * item.quantity}</h4>
                              <h5 style={{ textDecoration: "line-through", color: "lightgray" }}>&#8377;{item.productDetails.originalPrice * item.quantity}</h5>
                              <p style={{ color: "red", fontSize: "small" }}>{(((item.productDetails.originalPrice - item.productDetails.discountPrice) / item.productDetails.originalPrice) * 100).toFixed(2)}&#37;&nbsp;OFF</p>
                            </p>
                          </div>
                        </CardContent>
                        <CardContent style={{ padding: "0", width: "15%", display: "flex", justifyContent: "center" }}>
                          <div style={{ display: "flex", alignItems: "center" }} className={styles['font']}>
                            <Tooltip arrow color='error' title="Remove from cart" slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: 'offset',
                                    options: {
                                      offset: [0, -14],
                                    },
                                  },
                                ],
                              },
                            }}>
                              <IconButton>
                                <DeleteOutlineRoundedIcon onClick={() => removeItem(item.productDetails._id, item.size)} color='error' className={styles['hover']} />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </CardContent>
                        <CardContent style={{ padding: "0", width: "15%", display: "flex", justifyContent: "center" }}>
                          <div style={{ display: "flex", alignItems: "center" }} className={styles['font']}>
                            <Tooltip title="Move to wishlist" arrow slotProps={{
                              popper: {
                                modifiers: [
                                  {
                                    name: 'offset',
                                    options: {
                                      offset: [0, -14],
                                    },
                                  },
                                ],
                              },
                            }} >
                              <Checkbox color='error' onClick={() => moveWishlist(item.productDetails._id)} icon={<FavoriteBorder color='error' />} checkedIcon={<Favorite color='error' />} />
                            </Tooltip>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <hr />
            <div style={{ width: "20%" }}>
              <div style={{ display: "flex", height: "100%", flexDirection: "column", justifyContent: "space-between" }} className={styles['font']}>
                <div>
                  <h2>BILLING</h2>
                  <hr style={{ color: "lightgray" }} /><br />
                  <h5 style={{ fontSize: "small", display: "flex", flexWrap: "wrap" }}>
                    <span>PRICE&nbsp;DETAILS&nbsp;</span>
                    <span>({usercart.usercartItems.length} Items)</span>
                  </h5><br />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <p>Total MRP</p>
                    <p>&#8377;{usercart.totalMRP}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                    <p>Discount&nbsp;on&nbsp;MRP</p>
                    <p style={{ color: "green" }}>&#8722;&#8377;{usercart.totalMRP - usercart.discountMRP}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
                    <p>Coupon&nbsp;Discount</p>
                    <Link style={{ color: "red" }} to="/applycoupon">Apply Coupon</Link>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <p style={{ fontSize: "medium" }}>Shipping&nbsp;fee</p>
                    <p style={{ fontSize: "small" }}>Calculated&nbsp;at&nbsp;checkout</p>
                  </div><br />
                  <hr style={{ color: "lightgray" }} /><br />
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4>Total&nbsp;Amount</h4>
                    <h4>&#8377;{usercart.discountMRP}</h4>
                  </div><br />
                  <Button onClick={() => nav('/checkout')} variant='contained' color='error' style={{ width: "100%" }}><span className={styles['font']}>Proceed&nbsp;to&nbsp;Buy</span></Button>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </ThemeProvider>
      </>
    )
  }
  else {
    return (
      <>
        <NavigationBar link="cart" />
        <div style={{ paddingTop: '10%' }}>
          <div className={styles['empty-page']}>
            <h1>No items in your Cart</h1>
          </div>
        </div>
      </>
    );
  }
}

export default MyCart