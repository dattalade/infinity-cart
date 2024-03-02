import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, CardMedia } from '@mui/material'
import styles from '../../css/Men.module.css'
import Checkbox from '@mui/material/Checkbox';
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
  const [infinityCartCollections, setInfinityCartCollections] = useState([]) /* Entire Items in this Website */

  const [userWishlist, setUserWishlist] = useState
    ({
      userId: null,
      userWishlistItems: []
    })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getAll = async () => {
      await axios.post("https://infinitycart.onrender.com/getAll", { apparel: props.apparel })
        .then((response) => {
          setInfinityCartCollections(response.data)
        }).catch(err => {
          console.log(err);
        });

      await axios.post("https://infinitycart.onrender.com/getWishlistItems", { jwtToken: cookies.get('token') })
        .then((response) => {
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
      console.log(infinityCartCollections[0].defSize)
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

  if (loading) {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '120px' }}>
          <div className={styles['loading-progress']}>
            <CircularProgress color="error" />
          </div>
        </div>
      </>
    );
  }
  else if (infinityCartCollections.length > 0) {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '120px' }}>
          <div className={styles['top']} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            {infinityCartCollections.map((item, index) => (
              <React.Fragment key={index}>
                <div className={styles['font']} style={{ width: "250px", height: "350px", marginRight: "1%", marginBottom: "1%", boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px", borderRadius: "35px" }}>
                  <Card
                    sx={{ display: 'flex', flexWrap: "wrap", width: "fit-content", justifyContent: "space-between", boxShadow: "none" }}
                    style={{ borderRadius: "35px", height: "100%" }}
                  >
                    <div style={{ width: "100%" }}>
                      <div style={{ padding: "5%" }}>
                        <CardMedia onClick={() => nav(`/productdetails?apparel=${props.apparel}&id=${item._id}`)} component="img"
                          className={styles['hover-comp']} sx={{ width: "100%", borderRadius: "30px" }} image={`${item.image}`} />
                      </div>
                      <div style={{ margin: "0%", paddingLeft: "5%", paddingRight: "5%" }}>
                        <CardContent style={{ padding: "0", margin: "0", display: "flex", flexDirection: "column", alignItems: "center", flexWrap: "wrap" }}>
                          <h3 style={{ padding: "0%", margin: "0%", fontSize: "small" }}>
                            {item.displayName}&nbsp;
                            <Checkbox size='small' checked={userWishlist.userWishlistItems.find((element) => element === item._id) === undefined ? false : true}
                              onClick={(event) => wishlistItem(event, item._id)} name='checkWish' style={{ padding: "0", position: "relative", marginTop: "-10px" }} {...label} icon={<FavoriteBorder />} checkedIcon={<Favorite style={{ color: 'red' }} />} />
                          </h3>
                          <hr style={{ color: "lightgrey", width: "100%" }} />
                        </CardContent>
                      </div>
                      <div style={{ margin: "0%", paddingLeft: "5%", paddingRight: "5%", paddingTop: "10%" }}>
                        <CardContent style={{ padding: "0", margin: "0" }}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <h6>
                              <label style={{ color: "red", fontSize: "medium" }}>{(((item.originalPrice - item.discountPrice) / item.originalPrice) * 100).toFixed(2)}&#x25;&nbsp;OFF</label>&nbsp;&nbsp;
                            </h6>
                            <h5>
                              <label style={{ textDecorationLine: 'line-through' }}>&#8377;{item.originalPrice}</label>&nbsp;&nbsp;
                            </h5>
                            <h3>
                              <label>&#8377;{item.discountPrice}</label>&nbsp;&nbsp;
                            </h3>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div >
        <ToastContainer />
      </>
    )
  }
  else {
    return (
      <>
        <NavigationBar link={props.apparel} />
        <div style={{ paddingTop: '120px' }}>
          <div className={styles['empty-page']}>
            <h1>No Collections available</h1>
          </div>
        </div>
      </>
    );
  }
}

export default NavAccess