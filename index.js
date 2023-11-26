const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const flash = require('connect-flash'); // get error and show
const bodyparser = require("body-parser");
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();
app.use(cors())
// MongoDB Connection
const mongoconnect = process.env.MONGODB
mongoose.connect(mongoconnect, {
    useNewUrlParser: true
})

global.loggedIn = null;
const indexController = require('./controller/indexController');
const seller = require('./route/sellerRoute');
const buyer = require('./route/buyerRoute');

app.use(express.static(__dirname +'/public'));
// app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.json()); // change json to js object
app.use(express.urlencoded());
app.use(flash()); // flash message
app.use(expressSession({
    secret: "node secret", // secret key
    resave: false,
    saveUninitialized: true
})); // keep information of user when user use website

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());


app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
})

// app.use((req, res, next) => {
//     res.locals.message = req.session.message;
//     delete req.session.message;
//     next();
// })


app.set('view engine', 'ejs');

// Route
app.get('/', indexController);
app.use('/seller', seller);
app.use('/buyer', buyer);



const PORT = process.env.PORT || 4000;
app.listen(3000, () => {
    console.log(`Server Running On ${PORT}`);
})