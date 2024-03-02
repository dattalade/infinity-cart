import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Tooltip } from '@mui/material';
import styles from '../../css/ProductDisplay.module.css'
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material';
import NavigationBar from '../NavBars/NavigationBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Cookies from 'universal-cookie'
const cookies = new Cookies();


const ProductDisplay = () => {
  const searchQuery = useSearchParams()[0]
  const apparel = searchQuery.get('apparel')
  const itemId = searchQuery.get('id')
  const [usercart, setUsercart] = useState
    ({
      userId: null,
      usercartItems: []
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

  const nav = useNavigate();
  const [product, setProduct] = useState({})
  const [sizeHover, setSizeHover] = useState(-1);
  const [sizeClick, setSizeClick] = useState(-1);
  const [isWishlist, setIsWishlist] = useState(false);
  const [cartButton, setCartButton] = useState("Add to Cart");

  useEffect(() => {
    const getProductDetails = async () => {
      await axios.post("https://infinity-cart.onrender.com/specificProduct", { id: itemId })
        .then((response) => {
          // console.log(response.data)
          setProduct(response.data)
          let sum = 0;
          for (let i = 0; i < response.data.sizeData.length; i++) {
            sum += response.data.sizeData[i].quantity;
          }
          if (sum <= 0)
            setCartButton("Out of Stock");
        })
        .catch(err => {
          console.log(err);
        });
      await axios.post("https://infinity-cart.onrender.com/isWishlist", { id: itemId, jwtToken: cookies.get('token') })
        .then((response) => {
          // console.log(response.data)
          setIsWishlist(response.data)
        })
        .catch(err => {
          console.log(err);
        });
      await axios.post("https://infinity-cart.onrender.com/getProductCart", { id: itemId, jwtToken: cookies.get('token') })
        .then((response) => {
          setUsercart(prevusercart => ({
            ...prevusercart,
            userId: response.data.userId,
            usercartItems: response.data.usercartItems,
          }));

          if (apparel === "accessories") {
            let isThere = response.data.usercartItems.find((element) => element.itemId === itemId)
            console.log(isThere);
            if (isThere !== undefined)
              setCartButton("Go to Cart");
            else
              setCartButton("Add to Cart")
          }
        })
        .catch(err => {
          console.log(err);
        });
      setLoading(false)
    }
    getProductDetails();
  }, [itemId, sizeClick, apparel])

  const makeWishlist = async () => {
    await axios.post("https://infinity-cart.onrender.com/makeWishlist", { id: itemId, jwtToken: cookies.get('token') })
      .then((response) => {
        console.log(response.data)
        setIsWishlist(response.data)
      })
      .catch(err => {
        console.log(err);
      });
  }

  const sizeChange = (size, quantity) => {
    if (apparel !== "accessories") {
      setSizeClick(quantity > 0 ? size : -2);
      let isThere = usercart.usercartItems.find((element) => element.size === size)
      // console.log(isThere)
      if (sizeClick === -2)
        setCartButton("Out of Stock");
      else if (isThere === undefined)
        setCartButton("Add to Cart")
      else
        setCartButton("Go to Cart")
    }
    else {
      let isThere = usercart.usercartItems.find((element) => element.itemId === itemId)
      if (isThere === undefined)
        setCartButton("Add to Cart")
      else
        setCartButton("Go to Cart")
    }
  }

  const addToCart = () => {
    if (cookies.get('token') === undefined) {
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

    else if (apparel !== "accessories") {
      if (sizeClick === -1) {
        toast.warn("Please select the Size",
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
          });
      }
      else {
        axios.post('https://infinity-cart.onrender.com/addProductToCart', { size: sizeClick, userId: usercart.userId, itemId: itemId })
          .then((response) => {
            setUsercart(prevusercart => ({
              ...prevusercart,
              usercartItems: response.data.usercartItems
            }));
            setCartButton("Go to Cart")
          }).catch(err => {
            console.log(err);
          });
        toast.success("Item successfully is added to Cart",
          {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            style:
            {
              fontFamily: "'Noto Sans', sans-serif",
              textTransform: "uppercase",
              width: "300px"
            },
          });
      }
    }
    else {
      axios.post('https://infinity-cart.onrender.com/addProductToCart', { userId: usercart.userId, itemId: itemId })
        .then((response) => {
          setUsercart(prevusercart => ({
            ...prevusercart,
            usercartItems: response.data.usercartItems
          }));
          setCartButton("Go to Cart")
        }).catch(err => {
          console.log(err);
        });

      toast.success("Item successfully is added to Cart",
        {
          position: 'top-center',
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
        });
    }
  }

  if (loading) {
    return (
      <>
        <NavigationBar link={apparel} />
        <div style={{ paddingTop: '120px' }}>
          <div className={styles['loading-progress']}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ThemeProvider theme={theme}>

        <NavigationBar link={apparel} />
        <div className={styles['font']} style={{ margin: "0vh 10vh 0vh 10vh", marginTop: "0vh", paddingTop: "170px", height: "80vh" }}>
          <Card sx={{ width: "100%", height: "500px", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "space-between" }}>
              <Tooltip title='Click to view full image' placement='right'>
                <div className={styles['make-grid']} style={{ width: "35%", height: "100%" }} onClick={() => nav(`/view/${apparel}/${itemId}`)}>
                  <CardMedia className={`${styles['first']} ${styles['hover-comp']}`} component='img' image={`${product.image}`} />
                  <CardMedia className={`${styles['second']} ${styles['hover-comp']}`} component='img' image={`${product.image}`} />
                  <CardMedia className={`${styles['third']} ${styles['hover-comp']}`} component='img' image={`${product.image}`} />
                  <CardMedia className={`${styles['fourth']} ${styles['hover-comp']}`} component='img' image={`${product.image}`} />
                </div>
              </Tooltip>
              <div style={{ width: "65%", height: "100%" }}>
                <div style={{ padding: "2%" }}>
                  <CardContent>
                    <h2 className={styles['upperCase']}>{product.category}</h2>
                    <p style={{ color: "red" }}>{product.displayName}</p>
                    <hr style={{ color: "lightgrey" }} />
                  </CardContent>
                  <CardContent>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      <h1>
                        <label>&#8377;{product.discountPrice}</label>&nbsp;&nbsp;
                      </h1>
                      <h3>
                        <p>MRP<span style={{ textDecorationLine: 'line-through' }}>&#8377;{product.originalPrice}</span></p>
                      </h3>&nbsp;&nbsp;
                      <h4>
                        <label style={{ color: "red", fontSize: "medium" }}>{(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100).toFixed(2)}&#x25;&nbsp;OFF</label>&nbsp;&nbsp;
                      </h4>
                    </div>
                  </CardContent>
                  <CardContent>
                    <p style={{ fontWeight: "bold" }}>Select your size</p>
                    <CardActions sx={{ display: "flex", flexWrap: "wrap", paddingLeft: "0" }}>
                      {product.sizeData !== undefined ?
                        product.sizeData.map((item, index) => (
                          <React.Fragment key={index}>
                            {item.size !== undefined ? /* -2 is no quantity */
                              <div className={item.quantity > 0 ? styles['hover-comp'] : null}
                                onMouseEnter={() => { setSizeHover(item.quantity > 0 ? item.size : -2) }}
                                onMouseLeave={() => { setSizeHover(item.quantity > 0 ? -1 : -2) }}
                                onClick={() => sizeChange(item.size, item.quantity)}
                                style={{
                                  borderStyle: "solid", width: "20px", height: "20px", display: "flex", justifyContent: "center", alignItems: "center",
                                  textDecoration: item.quantity > 0 ? "none" : "line-through",
                                  borderColor: item.quantity > 0 ? (sizeHover === item.size ? "red" : (sizeClick === item.size ? "red" : "lightgrey")) : "lightgray",
                                  borderWidth: "1px", padding: "2%", borderRadius: "50%",
                                  color: item.quantity > 0 ? (sizeClick === item.size ? "red" : "black") : "lightgrey"
                                }}
                              >
                                <h3>{item.size}</h3>
                              </div> : null}
                          </React.Fragment>
                        )) : null}
                    </CardActions>
                    {/* For Accessories */}
                    <CardActions>
                      {apparel === "accessories" ?
                        <div className={styles['hover-comp']}
                          style={{ borderStyle: "solid", borderWidth: "1px", padding: "2%", borderColor: "red", color: "red" }}
                        >
                          <h3>One&nbsp;Size</h3>
                        </div> : null}
                    </CardActions>
                  </CardContent>
                  <CardContent sx={{ display: "flex", justifyContent: "space-between", width: "60%" }}>
                    {cartButton === "Add to Cart" ?
                      <Button onClick={addToCart} color='error' variant='contained' style={{ width: "45%", overflow: "clip" }}>
                        <span className={styles['font']} style={{ display: "flex" }}>
                          <HiOutlineShoppingBag style={{ fontSize: "x-large", fontWeight: "bold" }} />&nbsp;
                          <>{cartButton}</>
                        </span>
                      </Button>
                      : null
                    }

                    {cartButton === "Go to Cart" ?
                      <Button onClick={() => nav('/myCart')} color='error' variant='contained' style={{ width: "45%", overflow: "clip" }}>
                        <span className={styles['font']} style={{ display: "flex" }}>
                          <ShoppingBagOutlinedIcon />&nbsp;
                          <>{cartButton}</>
                        </span>
                      </Button>
                      : null
                    }

                    {cartButton === "Out of Stock" ?
                      <Button variant='outlined' disabled style={{ width: "45%", overflow: "clip" }}>
                        <span className={styles['font']} style={{ display: "flex" }}>
                          <ShoppingBagOutlinedIcon />&nbsp;
                          <>{cartButton}</>
                        </span>
                      </Button>
                      : null
                    }

                    {isWishlist ?
                      <Button onClick={() => nav('/wishlist')} variant='outlined' style={{ width: "45%", overflow: "clip", color: "red", borderColor: "lightgrey" }}>
                        <span className={styles['font']} style={{ display: "flex" }}>
                          <FavoriteIcon />&nbsp;
                          <>Wishlisted</>
                        </span>
                      </Button> :
                      <Button onClick={() => makeWishlist()} variant='outlined' color='error' style={{ width: "45%", overflow: "clip", color: "red", borderColor: "red" }}>
                        <span className={styles['font']} style={{ display: "flex", flexWrap: "wrap" }}>
                          <FavoriteBorderIcon color='error' />&nbsp;
                          <>Add&nbsp;to&nbsp;Wishlist</>
                        </span>
                      </Button>
                    }
                  </CardContent>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <ToastContainer />
      </ThemeProvider>
    </>
  )
}

export default ProductDisplay