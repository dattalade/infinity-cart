import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './components/UserData/Register';
import Login from "./components/UserData/Login";
import Home from "./components/NavElements/Home";
import Men from "./components/NavElements/Men";
import Kids from "./components/NavElements/Kids";
import Accessories from "./components/NavElements/Accessories";
import Footwear from "./components/NavElements/Footwear";
import MyCart from "./components/NavElements/MyCart";
import ProductDisplay from "./components/ProductDisplay/ProductDisplay";
import Wishlist from "./components/ProfileBar/Wishlist";
import Profile from "./components/ProfileBar/Profile";
import Orders from "./components/ProfileBar/Orders";
import Coupons from "./components/ProfileBar/Coupons";
import CheckOut from "./components/CheckOut/CheckOut";
import Help from "./components/NavElements/Help";
import PaymentSuccess from "./components/PaymentSuccess/PaymentSuccess";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/home" element={<Home />}></Route>
        <Route exact path="/men" element={<Men />}></Route>
        <Route exact path="/kids" element={<Kids />}></Route>
        <Route exact path="/help" element={<Help />}></Route>
        <Route exact path="/accessories" element={<Accessories />}></Route>
        <Route exact path="/footwear" element={<Footwear />}></Route>
        <Route exact path="/add-user" element={<Register />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/myCart" element={<MyCart />}></Route>
        <Route exact path="/checkout" element={<CheckOut />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route exact path="/profile/wishlist" element={<Wishlist />}></Route>
        <Route exact path="/profile/orders" element={<Orders />}></Route>
        <Route exact path="/profile/coupons" element={<Coupons />}></Route>
        <Route exact path="/order-placed" element={<PaymentSuccess />}></Route>
        <Route exact path="/profile/checkout" element={<CheckOut />}></Route>
        <Route exact path="/productdetails" element={<ProductDisplay />}></Route>
      </Routes>
    </Router>
  );
}

export default App;