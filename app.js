const http = require('http');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auths');
const cartRoutes = require('./routes/carts');
const socket = require('./socket');

const { Server } = require('socket.io');
const { placeOrder } = require('./controllers/orders');

require('dotenv').config();

const app = express();

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   next();
// });

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.use(cors());

app.use(express.json());

app.use('/auth', authRoutes);

app.use('/users', userRoutes);

app.use('/products', productRoutes);

app.use('/carts', cartRoutes);

console.log(process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(result => {
    const httpServer = http.createServer(app);
    // const server = app.listen(process.env.PORT || 5000);

    const io =new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    // const socketIO = require('socket.io');
    // const io1 = socketIO.listen(server);
    // console.log(io1);
    // io1.set('match origin protocol', true);
    // io1.set('origins', '*:*');

    // io1.on('send_order',data => {
    //   console.log('#84 socket receive order: ', data);
    // });

    // const io = require('./socket').init(server);
    io.on('connection', socket => {
      console.log('Client connected');
      socket.on('send_order', userId => {
        console.log('#84 socket receive order: ', userId);
        placeOrder(userId);
      });
    });
    httpServer.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });