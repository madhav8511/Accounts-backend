const mongoose = require('mongoose');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();
const userRouter = require('./routes/user');
const transRouter = require('./routes/transaction');
const cityRouter = require('./routes/city');
const imageRouter = require('./routes/image');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`${process.env.LOCAL_DATABASE}`);
  console.log('Database Connected');
}

const server = express();

server.use(express.json({  extended: true })); 
server.use(express.urlencoded({  extended: true }));
server.use(morgan('default'));
server.use(express.static('public'));
server.use(cors());

server.get('/',(req,res)=>{
    res.send("Hello World");
});

server.use('/user',userRouter.router);
server.use('/trans',transRouter.router);
server.use('/city',cityRouter.router);
server.use('/uploads',imageRouter.router);

server.listen(8080 ,()=>{
    console.log('Server Start');
});
