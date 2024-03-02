import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Card, CardActions, CardContent, CardMedia } from '@mui/material'
import styles from '../../css/Men.module.css'
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded';
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import Checkbox from '@mui/material/Checkbox';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../NavBars/NavigationBar';

const cookies = new Cookies();
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

const NavAccess = (props) => {
  const nav = useNavigate();
  const [cartItems, setCartItems] = useState([]) /* Entire Items in this Website */
  const [usercart, setUsercart] = useState
    ({
      userId: null,
      usercartItems: []
    })
  const [userWishlist, setUserWishlist] = useState
    ({
      userId: null,
      userWishlistItems: []
    })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAll = async () => {
      await axios.post("https://infinitycart.onrender.com/getAll", { apparel: props.apparel }).then((response) => {
        setCartItems(response.data)
      }).catch(err => {
        console.log(err);
      });

      await axios.post("https://infinitycart.onrender.com/getUserItems", { jwtToken: cookies.get('token') }).then((response) => {
        setUsercart(prevusercart => ({
          ...prevusercart,
          userId: response.data.userId,
          usercartItems: response.data.usercartItems,
        }));
      }).catch(err => {
        console.log(err);
      });

      await axios.post("https://infinitycart.onrender.com/getWishlistItems", { jwtToken: cookies.get('token') }).then((response) => {
        setUserWishlist(prevWishlist => ({
          ...prevWishlist,
          userId: response.data.userId,
          userWishlistItems: response.data.userWishlistItems,
        }));
      }).catch(err => {
        console.log(err);
      });
      setLoading(false);
    }
    getAll();
  }, [props.apparel])

  const cookie = useMemo(() => {
    return cookies.get('token')
  }, [])

  const changeCartFunctionality = (e, itemId, itemIndex) => {
    e.preventDefault();
    console.log(cartItems[itemIndex].defSize);
    const alreadyAr = usercart.usercartItems.find((element) => element.itemId === itemId)
    console.log(alreadyAr !== undefined)
    if (usercart.userId === null && cookie === undefined) {
      toast.info("Please Login to continue",
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
            textTransform: "uppercase"
          },
          onOpen: () => {
            setTimeout(() => {
              nav('/login');
            }, 3000);
          },
          onClose: () => {
            clearTimeout();
          }
        });
    }
    else if (cartItems[itemIndex].defSize === -20 && alreadyAr === undefined) {
      toast("Please select the Size",
        {
          position: 'top-right',
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
            textTransform: "uppercase"
          }
        });
    }
    else {
      //cart added
      axios.post("https://infinitycart.onrender.com/addToCart", { itemIdObject: itemId, userIdObject: usercart.userId, size: cartItems[itemIndex].defSize }).then((response) => {
        setUsercart(prevusercart => ({
          ...prevusercart,
          usercartItems: response.data.usercartItems
        }));
      }).catch(err => {
        console.log(err);
      });
      toast(alreadyAr === undefined ? "Item is added in Cart" : "Item is removed from Cart",
        {
          position: 'top-center',
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: e.target.checked ? styles["addWishList"] : styles["removeWishList"],
        });
    }
  }

  const changeHover = (bool, index) => {
    setCartItems((prevCart) => {
      const newCart = [...prevCart];
      newCart[index] = { ...newCart[index], hover: bool }
      return newCart
    })
  }

  const wishlistItem = (e, itemId) => {
    if (userWishlist.userId === null && cookie === undefined) {
      toast.info("Please Login to continue",
        {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          style:
          {
            fontFamily: "'Noto Sans', sans-serif",
            textTransform: "uppercase"
          },
          onOpen: () => {
            setTimeout(() => {
              nav('/login');
            }, 3000);
          },
          onClose: () => {
            clearTimeout();
          }
        });
    }
    else {
      console.log(cartItems[0].defSize)
      axios.post("https://infinitycart.onrender.com/arwishlist", { itemIdObject: itemId, userIdObject: userWishlist.userId, ar: e.target.checked }).then((response) => {
        console.log(response.data)
        setUserWishlist(prevWishlist => ({
          ...prevWishlist,
          userWishlistItems: response.data.userWishlistItems
        }));
      }).catch(err => {
        console.log(err);
      });
      toast(e.target.checked ? "Item is Wishlisted" : "Item is removed from Wishlist",
        {
          position: 'top-center',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          className: e.target.checked ? styles["addWishList"] : styles["removeWishList"],
        });
    }
  }

  const changeItemSize = (sizeNumber, itemIndex) => {
    console.log(cartItems[itemIndex].defSize + " " + itemIndex + " " + sizeNumber)
    if (cartItems[itemIndex].defSize === -20 || cartItems[itemIndex].defSize !== sizeNumber) {
      console.log("Enter")
      setCartItems((prevCartItems) => {
        const updatedCart = [...prevCartItems];
        updatedCart[itemIndex].defSize = sizeNumber;
        return updatedCart
      });
    }
    else {
      console.log("Re-Enter")
      setCartItems((prevCartItems) => {
        const updatedCart = [...prevCartItems];
        updatedCart[itemIndex].defSize = -20;
        return updatedCart
      });
    }
  }

  if (loading) {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '10%' }}>
          <div className={styles['loading-progress']}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }
  else if (cartItems.length > 0) {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '10%' }}>
          <div className={styles['top']}>
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <div className={styles['apparel']}>
                  <Card sx={{ boxShadow: "0 0 16px rgba(0, 0, 0, 0.15)", borderRadius: "15px", marginBottom: "70px" }} key={index}>
                    <div>
                      <CardMedia className={styles['hover-comp']}
                        onClick={() => nav(`/${props.apparel}/${item._id}`)} component="img" image={`${item.image}`}
                        sx={{ width: '100%', margin: "4%", height: '40vh', border: "none", borderRadius: "15px" }} alt='Missing'
                      />
                      <CardContent style={{ paddingTop: "0", paddingBottom: "0" }}>
                        <center style={{ padding: "3%" }}>
                          <h4 className={styles['font']}>
                            <label>ADD TO <span style={{ color: 'red' }}>WISHLIST</span></label>&nbsp;&nbsp;
                            <Checkbox checked={userWishlist.userWishlistItems.find((element) => element === item._id) === undefined ? false : true}
                              onClick={(event) => wishlistItem(event, item._id)} name='checkWish' style={{ padding: "0", position: "relative", marginTop: "-10px" }} {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite style={{ color: 'red' }} />} />
                          </h4>
                        </center>
                        <hr style={{ marginBottom: "3%", color: "lightgray" }} />
                        <h3 className={styles['font']} style={{ paddingBottom: "10px", display: "flex", justifyContent: "center" }}>
                          <label>{(item.displayName)}</label>
                        </h3>
                        <div className={styles['font']} style={{ display: "flex", justifyContent: "center" }}>
                          <h6>
                            <label style={{ color: "red" }}>{(((item.originalPrice - item.discountPrice) / item.originalPrice) * 100).toFixed(2)}&#x25;&nbsp;OFF</label>&nbsp;&nbsp;
                          </h6>
                          <h5>
                            <label style={{ textDecorationLine: 'line-through' }}>{item.originalPrice}</label>&nbsp;&nbsp;
                          </h5>
                          <h3>
                            <label>{item.discountPrice}</label>&nbsp;&nbsp;
                          </h3>
                        </div>
                        <hr style={{ color: "lightgray" }} />
                        <div style={{ width: "100%" }}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <div style={{ display: "flex" }}>
                              {item.sizeData.map((sizeData, index1) =>
                                sizeData.size !== undefined ?
                                  <React.Fragment key={index1}>
                                    <Checkbox
                                      icon={<BookmarkBorderIcon />}
                                      checkedIcon={<BookmarkIcon />}
                                      style={{ color: sizeData.quantity === 0 ? "gray" : "red" }}
                                      checked={sizeData.quantity === 0 ? true : (item.defSize === sizeData.size)}
                                      onClick={() => changeItemSize(sizeData.size, index)}
                                      disabled={sizeData.quantity === 0 ? true : false}
                                    />
                                    <label style={{ display: "flex", alignItems: "center" }}><h5>{sizeData.size}</h5></label>
                                  </React.Fragment> :
                                  <React.Fragment key={index1}></React.Fragment>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardActions style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant={item.hover === true ? "outlined" : "contained"} color="error"
                          onMouseEnter={() => { changeHover(true, index) }}
                          onMouseLeave={() => { changeHover(false, index) }}
                          onClick={(event) => changeCartFunctionality(event, item._id, index)}
                          disabled={item.quantity === 0 ? true : false}
                        >
                          {
                            item.quantity !== 0 ? (usercart.userId === null ?
                              <AddShoppingCartRoundedIcon style={{ paddingTop: "-2px" }} /> :
                              (usercart.usercartItems.find(function (element) { return element.itemId === item._id }) === undefined ?
                                <AddShoppingCartRoundedIcon style={{ paddingTop: "-2px" }} /> :
                                <RemoveShoppingCartRoundedIcon style={{ paddingTop: "-2px" }} />)) : (<ShoppingBagOutlinedIcon style={{ paddingTop: "-2px" }} />)
                          }&nbsp;&nbsp;
                          <span className={styles['addrembuttons']}>
                            <h4>
                              {
                                usercart.userId === null ? (item.quantity !== 0 ? "Add to Cart" : "Out of Stock") :
                                  (item.quantity === 0 ? "Out of Stock" : (usercart.usercartItems.find(function (element) { return element.itemId === item._id }) === undefined ? "Add to Cart" :
                                    "Remove from Cart"))
                              }
                            </h4>
                          </span>
                        </Button>
                      </CardActions>
                    </div>
                  </Card>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        <ToastContainer />
      </>
    )
  }
  else {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '10%' }}>
          <div className={styles['empty-page']}>
            <h1>No Collections available</h1>
          </div>
        </div>
      </>
    );
  }
}

export default NavAccess