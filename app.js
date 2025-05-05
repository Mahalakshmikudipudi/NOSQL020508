const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('681865cd3a8a678a773e47dd')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://mahalakshmiguthula125:41FkP94zrgTlrbgC@cluster0.5z4dqka.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
  .then(result => {
    app.listen(3000);
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log(err);
  });
