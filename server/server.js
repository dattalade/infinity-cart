const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/UserData');
const LogDetails = require('./models/LogDetails');
const UserCart = require('./models/UserCart')
const WishList = require('./models/Wishlist');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer')
const cors = require('cors');
const Razorpay = require('razorpay');
const TotalInfinityCollections = require('./models/TotalInfinityCollections');
const UserOrder = require('./models/UserOrder');
const UserAddress = require('./models/UserAddress');
const UserData = require('./models/UserData');
const app = express();
const PORT = process.env.PORT || 5000;

const SECRET_KEY = 'infinitydattalade123456789@@@@@@@@@'

app.use(cors());
app.use(express.json());
const uri = 'mongodb+srv://dattalade:dattalade@cluster0.fade8bn.mongodb.net/infinity?retryWrites=true&w=majority'
mongoose.connect(uri);
console.log('Connected to the database');

const transporter = nodemailer.createTransport
  ({
    service: 'gmail',
    auth: {
      user: '2100031692cseh@gmail.com',
      pass: 'snkriyvximcvsuqa',
    },
  });

const razorpay = new Razorpay({
  key_id: 'rzp_test_byEpIl0N6kfEaV',
  key_secret: 'pKoCm4xpzz7j0bVbmG7A1JCW',
});

app.get('/', async (req, res) => {
  res.json({ "good": "cart" });
});

const consoleRegister = (userData) => {
  //Full Name
  if (userData.name.length < 3) {
    return { type: "Your Name", message: "length will be greater than 3" }
  }
  for (let i = 0; i < userData.name.length; i++) {
    let ch = userData.name.charCodeAt(i);
    if (ch >= 48 && ch <= 57) {
      return ({ type: "Your Name", message: "must not contain numbers" });
    }
    if (!(ch >= 65 && ch <= 90) && !(ch >= 97 && ch <= 122) && !(ch >= 48 && ch <= 57) && !(ch == 32)) {
      return ({ type: "Your Name", message: "must not special characters" });
    }
  }
  //E-mail
  if (!userData.email.includes('@gmail.com'))
    return ({ type: "Mail", message: "must include '@gmail.com'" });

  //Mobile Number
  if (userData.mobile.length != 10)
    return ({ type: "Mobile Number", message: "must be only 10 digits" });

  //State
  if (userData.state == 'Select State')
    return ({ type: "State", message: "must be selected" });

  //District
  if (userData.district == 'Select District')
    return ({ type: "Select any District", message: `that belongs to ${userData.state}` });

  //Password
  if (userData.password != userData.repassword)
    return ({ type: "Entered Password and Re-Enter Password", message: "must be same" });
  if (userData.password.length < 8)
    return ({ type: "Password", message: "must be greater than 8" });
  if (!(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(userData.password)))
    return ({ type: "Password", message: "must contain atleast one special character" });

  //No Falses
  return null;
}

app.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    let json = consoleRegister(userData);
    if (json)
      return res.json(json);

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = new User
      ({
        name: userData.name,
        email: userData.email,
        dob: userData.dob,
        mobile: userData.mobile,
        state: userData.state,
        district: userData.district,
        password: hashedPassword,
        whenRegistered: new Date(),
      });

    await User.findOne({ email: userData.email }).exec()
      .then((result) => {
        const foundData = result;
        if (foundData)
          json = { type: "User", message: "already exists" }
      })
      .catch((err) => {
        console.error(err);
      });

    if (json) {
      return res.json(json);
    }

    const tokens = jwt.sign({ email: userData.email }, SECRET_KEY, { expiresIn: '1h' });
    const verificationLink = `https://infinity-cart.onrender.com/verify?token=${tokens}`;

    const mailOptions =
    {
      from: '2100031692cseh@gmail.com',
      to: userData.email,
      subject: 'Verify Infinity Account',
      text: `Click the following link to verify your email: ${verificationLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error occurred:', error.message);
      }
      else {
        console.log('Message sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    });

    await newUser.save();

    return res.json({ type: "Verify", message: "email to continue" })
  }
  catch (error) {
    console.error(error);
    return res.json({ type: "Internal Error :", message: 'Refresh and try again' });
  }
});

app.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.json({ type: "Invalid", message: 'verification token.' });
    }

    user.isVerified = true;
    await user.save();

    const userCartData = new UserCart
      ({
        userId: user._id,
        usercartItems: []
      });
    await userCartData.save();

    const wishlistData = new WishList
      ({
        userId: user._id,
        userWishlistItems: [],
      })
    await wishlistData.save();

    const orderData = new UserOrder
      ({
        userId: user._id,
        userOrderItems: []
      })
    await orderData.save();

    const addressData = new UserAddress
      ({
        userId: user._id,
        userDiffAdd: []
      })
    await addressData.save();

    res.redirect('https://infinity-cart.vercel.app/login');
  }
  catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid verification token.' });
  }
});

var token = null

app.post('/login', async (req, res) => {
  try {
    const userData = req.body;
    const user = await User.findOne({ email: userData.email });

    if (!user)
      return res.json({ type: "Email", message: "doesn't exist" })
    if (!user.isVerified)
      return res.json({ type: "Please Verify", message: "E-mail to continue" });

    const passwordMatch = await bcrypt.compare(userData.password, user.password);
    if (!passwordMatch)
      return res.json({ type: "Password", message: "is incorrect" });

    const log = await LogDetails.findOne({ email: userData.email }).exec();
    let logDetails;
    if (!log) {
      logDetails = new LogDetails
        ({
          email: userData.email,
          logs: [new Date()]
        });
      await logDetails.save();
    }
    else {
      log.logs.push(new Date())
      await log.save();
    }

    token = jwt.sign({ userId: user._id }, SECRET_KEY,); //{ expiresIn: '1h' }
    return res.json({ type: "Login", message: "Success", token: token });
  }
  catch (error) {
    return res.json({ type: "Internal", message: "Server Error" });
  }
});

const getQuantity = (sizeData) => {
  let sum = 0;
  for (let i = 0; i < sizeData.length; i++) {
    sum += sizeData[i].quantity;
  }
  return sum;
}

app.post("/getAll", async (req, res) => {
  try {
    const collections = await TotalInfinityCollections.find({ apparel: req.body.apparel });
    const items = collections.map((item) => ({
      _id: item._id,
      imageName: item.imageName,
      image: item.image,
      apparel: item.apparel,
      category: item.category,
      designType: item.designType,
      displayName: item.displayName.toUpperCase(),
      originalPrice: item.originalPrice,
      discountPrice: item.discountPrice,
      sizeData: item.sizeData,
      defSize: item.sizeData[0].size === undefined ? -10 : -20, // -10 is for accessories no sizes, -20 is for available size
      quantity: getQuantity(item.sizeData)
    }));
    // console.log(items)
    return res.json(items)
  }
  catch (error) {
    return res.json({ type: "Internal", message: "Server Error" });
  }
})

app.post("/getUserItems", async (req, res) => {
  const { jwtToken } = req.body

  if (jwtToken == null)
    return res.json({ userId: null, usercartItems: [] })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, usercartItems: [] })
      }
      else {
        const items = await UserCart.findOne({ userId: decoded.userId });
        return res.json({ userId: items.userId, usercartItems: items.usercartItems })
      }
    })
  }
})

app.post("/getUserInfo", async (req, res) => {
  const { jwtToken } = req.body

  if (jwtToken == null)
    return res.json({ name: "" })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ name: "" })
      }
      else {
        const details = await User.findById(decoded.userId);
        res.json(details)
      }
    })
  }
})

app.post("/getWishlistItems", async (req, res) => {
  const { jwtToken } = req.body

  if (jwtToken == null)
    return res.json({ userId: null, userWishlistItems: [] })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, userWishlistItems: [] });
      }
      else {
        const items = await WishList.findOne({ userId: decoded.userId })
        return res.json({ userId: items.userId, userWishlistItems: items.userWishlistItems });
      }
    })
  }
})

app.post("/addToCart", async (req, res) => {
  const { itemIdObject, userIdObject, size } = req.body;
  const result = await UserCart.findOne({ userId: userIdObject, });
  const result1 = result.usercartItems.find(function (element) { return element.itemId != null && itemIdObject == element.itemId && element.itemId != undefined })
  // console.log(result1);
  if (result1 == undefined || result1 == null) {
    var itemSchema;
    if (size > 0) {
      itemSchema =
      {
        itemId: itemIdObject,
        quantity: 1,
        size: size
      }
    }
    if (size < 0) {
      itemSchema =
      {
        itemId: itemIdObject,
        quantity: 1,
      }
    }

    result.usercartItems.push(itemSchema);
    await result.save();
    return res.json({ usercartItems: result.usercartItems })
  }
  else if (result1 != undefined || result1 != null) {
    try {
      const result = await UserCart.findOneAndUpdate({ userId: userIdObject },
        { $pull: { usercartItems: { itemId: itemIdObject } } }, { new: true })
      await result.save();
      return res.json({ usercartItems: result.usercartItems });
    }
    catch (err) {
      // return res.json({usercartItems: result.usercartItems});
    }
  }
})

app.post("/arwishlist", async (req, res) => {
  const { itemIdObject, userIdObject, ar } = req.body;
  try {
    const coll = await WishList.findOne({ userId: userIdObject })
    // console.log(typeof coll.userWishlistItems.find((element) => element == itemIdObject))
    if (ar && !coll.userWishlistItems.find((element) => element == itemIdObject)) {
      coll.userWishlistItems.push(itemIdObject);
      await coll.save();
      return res.json({ userWishlistItems: coll.userWishlistItems })
    }
    if (!ar && coll.userWishlistItems.find((element) => element == itemIdObject)) {
      let coll1 = await WishList.findOneAndUpdate({ userId: userIdObject }, { $pull: { userWishlistItems: itemIdObject } });
      await coll1.save();
      coll1 = await WishList.findOne({ userId: userIdObject })
      return res.json({ userWishlistItems: coll1.userWishlistItems })
    }
  }
  catch (error) {
    return res.json({ type: "Internal", message: "Server Error" });
  }
})

app.post("/getCartInfo", async (req, res) => {
  const { jwtToken } = req.body
  if (jwtToken == null)
    return res.json({ userId: null, usercartItems: [] });
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, usercartItems: [] })
      }
      else {
        const cartInfo = await UserCart.findOne({ userId: decoded.userId });
        const collections = await TotalInfinityCollections.find({ _id: { $in: cartInfo.usercartItems.map((element) => element.itemId) } })

        const cartData = cartInfo.usercartItems.map((element, index) =>
        ({
          productDetails: collections.filter((value) => JSON.stringify(value._id) == JSON.stringify(element.itemId))[0],
          quantity: element.quantity,
          size: element.size
        }))

        let totalMRP = 0, discountMRP = 0;
        for (let i = 0; i < cartData.length; i++) {
          totalMRP += (cartData[i].productDetails.originalPrice * cartData[i].quantity);
          discountMRP += (cartData[i].productDetails.discountPrice * cartData[i].quantity);
        }
        // console.log(cartData[0].productDetails)
        return res.json({ userId: decoded.userId, usercartItems: cartData, totalMRP: totalMRP, discountMRP: discountMRP });
      }
    })
  }
})

app.post("/updateQuantity", async (req, res) => {
  const { userId, itemId, updatedQuantity, index } = req.body;
  const coll = await UserCart.findOne({ userId: userId });
  coll.usercartItems[index].quantity = updatedQuantity == "+" ? coll.usercartItems[index].quantity + 1 : coll.usercartItems[index].quantity - 1;
  await coll.save();
  return res.json({ quantity: coll.usercartItems[index].quantity })
})

app.post("/removeItem", async (req, res) => {
  const { userId, itemId, size } = req.body;
  if (size == undefined) {
    try {
      const result = await UserCart.findOneAndUpdate({ userId: userId },
        { $pull: { usercartItems: { itemId: itemId } } }, { new: true })
      await result.save();
      return res.json({ usercartItems: result.usercartItems });
    }
    catch (err) {
      // return res.json({usercartItems: result.usercartItems});
    }
  }
  else {
    try {
      const result = await UserCart.findOneAndUpdate({ userId: userId },
        { $pull: { usercartItems: { itemId: itemId, size: size } } }, { new: true })
      await result.save();
      return res.json({ usercartItems: result.usercartItems });
    }
    catch (err) {
      // return res.json({usercartItems: result.usercartItems});
    }
  }
})

app.post("/specificProduct", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await TotalInfinityCollections.findById(id);
    return res.json(result);
  }
  catch (err) {
    return res.json({})
  }
})

app.post("/isWishlist", async (req, res) => {
  const { id, jwtToken } = req.body;
  if (jwtToken == null)
    return res.send(false)
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.send(false);
      }
      else {
        const coll = await WishList.findOne({ userId: decoded.userId });
        let bool = coll.userWishlistItems.find((element) => JSON.stringify(element) == JSON.stringify(id));
        res.send(bool == undefined ? false : true);
      }
    })
  }
})

app.post("/makeWishlist", async (req, res) => {
  const { id, jwtToken } = req.body;
  if (jwtToken == null)
    return res.send(false)
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.send(false);
      }
      else {
        const coll = await WishList.findOne({ userId: decoded.userId });
        coll.userWishlistItems.push(id);
        await coll.save();
        res.send(true);
      }
    })
  }
})

app.post("/getProductCart", async (req, res) => {
  const { id, jwtToken } = req.body;
  if (jwtToken == null)
    return res.json({ userId: null, usercartItems: [] })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, usercartItems: [] })
      }
      else {
        const coll = await UserCart.findOne({ userId: decoded.userId });
        const sendData = coll.usercartItems.map((element, index) => JSON.stringify(element.itemId) == JSON.stringify(id) ? element : null).filter((value) => value != null);
        // console.log(sendData);
        res.json({ userId: decoded.userId, usercartItems: sendData });
      }
    })
  }
})

app.post("/updateUserDetails", async (req, res) => {
  const { name, state, _id, district, dob } = req.body;
  const userData = await User.findById(_id);
  userData.name = name;
  userData.state = state;
  userData.district = district;
  userData.dob = dob;
  await userData.save();
  res.json(userData);
})

app.post("/getUserWishlist", async (req, res) => {
  const { jwtToken } = req.body;
  if (jwtToken == null)
    return res.json({ userId: null, userWishlistItems: [] })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, userWishlistItems: [] })
      }
      else {
        const wishlist = await WishList.findOne({ userId: decoded.userId });
        const totalItems = await TotalInfinityCollections.find({})
        const userWishlistItems = wishlist.userWishlistItems.map((element, index) => ({
          productInfo: totalItems.find((product) => JSON.stringify(product._id) == JSON.stringify(element))
        }))
        // console.log(userWishlistItems)
        res.json({ userId: decoded.userId, userWishlistItems: userWishlistItems })
      }
    })
  }
})

app.post("/addProductToCart", async (req, res) => {
  const { size, userId, itemId } = req.body;
  const coll = await UserCart.findOne({ userId: userId });

  if (size !== undefined) {
    coll.usercartItems.push({ itemId: itemId, quantity: 1, size: size });
    await coll.save();
  }
  else {
    coll.usercartItems.push({ itemId: itemId, quantity: 1 });
    await coll.save();
  }
  const sendData = coll.usercartItems.map((element, index) => JSON.stringify(element.itemId) == JSON.stringify(itemId) ? element : null).filter((value) => value != null);
  res.json({ userId: userId, usercartItems: sendData });
})

app.post("/getUserAddress", async (req, res) => {
  const { jwtToken } = req.body;
  if (jwtToken == null)
    return res.json({ userId: null, address: [] })
  else {
    jwt.verify(jwtToken, SECRET_KEY, async (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:');
        return res.json({ userId: null, address: [] })
      }
      else {
        const addColl = await UserAddress.findOne({ userId: decoded.userId })
        return res.json({ userId: decoded.userId, address: addColl.userDiffAdd })
      }
    })
  }
})

app.post("/addAddress", async (req, res) => {
  const { deliveryData, userId } = req.body;
  try {
    const coll = await UserAddress.findOne({ userId: userId })

    console.log(deliveryData)
    coll.userDiffAdd.push(deliveryData);
    coll.save();
    return res.json({ address: coll.userDiffAdd })
  }
  catch (err) {
    res.json({ address: [] })
  }
})

app.post("/addBasic", async (req, res) => {
  const { userId, itemId, apparel } = req.body;

  const coll = await UserCart.findOne({ userId: userId });
  const totalColl = await TotalInfinityCollections.find({});
  const isThere = coll.usercartItems.find((element) => JSON.stringify(element.itemId) == JSON.stringify(itemId));

  if (apparel === 'accessories') {
    if (isThere == undefined) {
      coll.usercartItems.push({ itemId: itemId, quantity: 1 });
      await coll.save();
    }
  }
  else {
    if (isThere == undefined) {
      const fSize = totalColl.find((element) => JSON.stringify(element._id) == JSON.stringify(itemId))
      coll.usercartItems.push({ itemId: itemId, quantity: 1, size: fSize.sizeData[0].size });
      await coll.save();
    }
  }

  let wishlist = await WishList.findOneAndUpdate({ userId: userId }, { $pull: { userWishlistItems: itemId } });
  await wishlist.save();
  wishlist = await WishList.findOne({ userId: userId });

  const sendData = wishlist.userWishlistItems.map((element, index) =>
  ({
    productInfo: totalColl.find((product) => JSON.stringify(product._id) == JSON.stringify(element))
  }))
  // console.log(sendData);
  res.json({ userWishlistItems: sendData })
})

app.post('/placecashorder', async (req, res) => {
  const { userId, addressId, costDetails, paymentType } = req.body;

  const cartItems = await UserCart.findOne({ userId: userId });
  const orders = await UserOrder.findOne({ userId: userId });

  const userOrder = {
    itemDetails: cartItems.usercartItems,
    cost: {
      totalCost: costDetails.totalCost,
      payCost: costDetails.payCost,
      shippingCost: costDetails.shippingCost
    },
    paymentType: paymentType,
    addressId: addressId
  }
  orders.userOrderItems.push(userOrder);

  await orders.save();

  // const template = fs.readFileSync('./ejs/OrderDetails.ejs', 'utf-8');
  const sendColl = await TotalInfinityCollections.find({ _id: { $in: cartItems.usercartItems.map((element) => element.itemId) } })

  const ejsData = cartItems.usercartItems.map((data) => ({
    productName: sendColl.find((element) => JSON.stringify(element._id) === JSON.stringify(data.itemId)).displayName,
    quantity: data.quantity,
    size: data.size == undefined ? "One Size" : data.size,
    cost: data.quantity * (sendColl.find((element) => JSON.stringify(element._id) === JSON.stringify(data.itemId)).discountPrice)
  }))

  let sum = 0;

  for (let i = 0; i < ejsData.length; i++)
    sum += ejsData[i].cost

  const recEmail = await UserData.findById(userId)

  ejs.renderFile(path.join(__dirname, 'ejs', './OrderDetails.ejs'), { ejsData: ejsData, totalCost: sum }, (err, html) => {
    // console.log(template)
    if (err) {
      console.error('Error rendering template:', err.message);
    }
    else {
      const mailOptions =
      {
        from: '2100031692cseh@gmail.com',
        to: recEmail.email,
        html: html
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        }
        else {
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
      });
    }
  });

  cartItems.usercartItems = []
  await cartItems.save();
  res.json({ orderId: orders.userOrderItems[orders.userOrderItems.length - 1]._id })
  // res.redirect(`https://infinity-cart.vercel.app/order-placed?order-id=${orders.userOrderItems[orders.userOrderItems.length - 1]._id}`)
})

app.post('/get-checkout-details', async (req, res) => {
  const { userId, addressId } = req.body;
  const ans1 = await UserAddress.findOne({ userId: userId })
  const res1 = ans1.userDiffAdd.map((element) => JSON.stringify(element._id) === JSON.stringify(addressId));
  const ans2 = await UserData.findById(userId)

  res.json({ name: res1.name, mobile: res1.mobile, email: ans2.email })
})

app.post("/create-order", async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100),
    currency: 'INR',
  };
  try {
    const order = await razorpay.orders.create(options);
    // console.log(order)
    res.json(order);
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/payment-verification', async (req, res) => {
  const { razorpay_signature, razorpay_payment_id, razorpay_order_id, userId, addressId, costDetails, paymentType } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", 'pKoCm4xpzz7j0bVbmG7A1JCW')
    .update(body.toString())
    .digest("hex");
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    console.log(isAuthentic);
    const cartItems = await UserCart.findOne({ userId: userId });
    const orders = await UserOrder.findOne({ userId: userId });

    const userOrder = {
      itemDetails: cartItems.usercartItems,
      cost: {
        totalCost: costDetails.totalCost,
        payCost: costDetails.payCost,
        shippingCost: costDetails.shippingCost
      },
      paymentType: paymentType,
      paymentInfo: {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
      },
      addressId: addressId
    }
    orders.userOrderItems.push(userOrder);

    await orders.save();
    const sendColl = await TotalInfinityCollections.find({ _id: { $in: cartItems.usercartItems.map((element) => element.itemId) } })

    const ejsData = cartItems.usercartItems.map((data) => ({
      productName: sendColl.find((element) => JSON.stringify(element._id) === JSON.stringify(data.itemId)).displayName,
      quantity: data.quantity,
      size: data.size == undefined ? "One Size" : data.size,
      cost: data.quantity * (sendColl.find((element) => JSON.stringify(element._id) === JSON.stringify(data.itemId)).discountPrice)
    }))

    let sum = 0;

    for (let i = 0; i < ejsData.length; i++)
      sum += ejsData[i].cost

    const recEmail = await UserData.findById(userId)

    ejs.renderFile(path.join(__dirname, 'ejs', './OrderDetails.ejs'), { ejsData: ejsData, totalCost: sum }, (err, html) => {
      // console.log(template)
      if (err) {
        console.error('Error rendering template:', err.message);
      }
      else {
        const mailOptions =
        {
          from: '2100031692cseh@gmail.com',
          to: recEmail.email,
          html: html
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
      }
    });

    cartItems.usercartItems = []
    await cartItems.save();
    res.json({ paymentId: razorpay_payment_id, success: true })
    // res.redirect(`https://infinity-cart.vercel.app/order-placed?payment-id=${razorpay_payment_id}`)
  }
  else {
    console.log("Failure")
    res.json({ success: false })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
