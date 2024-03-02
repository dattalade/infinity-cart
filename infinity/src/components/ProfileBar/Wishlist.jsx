import React, { useEffect, useState } from 'react'
import SideBar from '../NavBars/SideBar'
import styles from '../../css/Wishlist.module.css'
import Cookies from 'universal-cookie'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardMedia } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
const cookies = new Cookies();

const Wishlist = () => {

  const [userWishlist, setUserWishlist] = useState
    ({
      userId: null,
      userWishlistItems: []
    })

  const nav = useNavigate();

  useEffect(() => {
    const getUserWish = async () => {
      await axios.post("https://infinity-cart.onrender.com/getUserWishlist", { jwtToken: cookies.get('token') })
        .then((response) => {
          setUserWishlist((prevUserWishlist) => ({
            ...prevUserWishlist,
            userId: response.data.userId,
            userWishlistItems: response.data.userWishlistItems
          }))
        }).catch(err => {
          console.log(err);
        });
    }
    getUserWish();
  }, [])

  const moveToCart = (itemId, apparel) => {
    // console.log(itemId)
    const addCart = async () => {
      await axios.post("https://infinity-cart.onrender.com/addBasic", { userId: userWishlist.userId, itemId: itemId, apparel: apparel })
        .then((response) => {
          setUserWishlist((prevUserWishlist) => ({
            ...prevUserWishlist,
            userWishlistItems: response.data.userWishlistItems
          }))
          console.log("ADD")
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
        }).catch(err => {
          console.log(err);
        });
    }
    addCart();
  }

  if (userWishlist.userWishlistItems.length === 0) {
    return (
      <div style={{ display: "flex" }}>
        <SideBar highlight="wishlist" />
        <div
          style={{
            marginLeft: "17.5%", height: "90vh", width: "82.5%", padding: "5vh",
            overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}
        >
          <h1 style={{ color: "red" }}>Your&nbsp;Wishlist&nbsp;is&nbsp;empty</h1>
          <Link to="/" style={{ color: "blue", padding: "2%" }}>Shop Now</Link>
        </div>
      </div>
    )
  }
  else if (userWishlist.userId !== null) {
    return (
      <div style={{ display: "flex" }}>
        <SideBar highlight="wishlist" />
        <div style={{ marginLeft: "17.5%", height: "90vh", width: "82.5%", padding: "5vh", overflow: "hidden" }}>
          <div className={styles['profile']}>
            <div className={styles['wishFlex']} style={{ width: "96%", padding: "2%" }}>
              {userWishlist.userWishlistItems.map((element, index) =>
                <React.Fragment key={index}>
                  <div
                    style={{
                      width: "250px", height: "300px", marginRight: "2%", marginBottom: "2%",
                      boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", borderRadius: "35px"
                    }}
                  >
                    <Card
                      sx={{ display: 'flex', flexWrap: "wrap", width: "fit-content", justifyContent: "space-between", boxShadow: "none" }}
                      style={{ width: "100%", borderRadius: "35px", height: "100%" }}
                    >
                      <div style={{ width: "100%" }}>
                        <div style={{ padding: "5%" }}>
                          <CardMedia component="img" onClick={() => nav(`/${element.productInfo.apparel}/${element.productInfo._id}`)}
                            className={styles['hover-comp']} sx={{ width: "100%", borderRadius: "30px" }} image={`${element.productInfo.image}`} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                          <CardContent style={{ padding: "0" }}>
                            <Button variant='contained' color='error'
                              onClick={() => moveToCart(element.productInfo._id, element.productInfo.apparel)}>
                              <span>Move&nbsp;to&nbsp;Cart</span>
                            </Button>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    )
  }

}

export default Wishlist