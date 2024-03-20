let model = require('../model/user');
const User = model.User;

model = require('../model/transaction');
const Transaction = model.Transaction;

const jwt = require("jsonwebtoken");
require('dotenv').config()

exports.getAlluser = async (req,res)=>{
    const user = await User.find();
    res.json(user);
}

exports.searchUser = async (req,res)=>{
    const user = await User.find({name: req.query.name});
    res.json(user);
}

exports.getUserbyCity = async (req,res)=>{
    const user = await User.find({address: req.query.address});
    res.json(user);
}

exports.verifyUser = async (req,res)=>{
    const user = await User.findOne({mobileno: req.query.mobileno});
    if(user){
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,process.env.JWT_SECRET);
        res.json(authtoken);
    }
    else res.send("Not exist");
}

exports.createUser = async (req,res)=>{
    const user = new User();
    const existuser = await User.findOne({mobileno: req.body.mobileno});

    if(!existuser){

        user.name = req.body.name;
        user.mobileno = req.body.mobileno;
        user.address = req.body.address;
        await user.save();

        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data,process.env.JWT_SECRET);
        res.json(authtoken);
    }
    else
    {
        res.send("User exist");
    }
}

exports.deleteUser = async (req,res)=>{
    let user = await User.findById(req.params.id);
    const trans = await Transaction.deleteMany({user: user._id});
    user = await User.findByIdAndDelete(req.params.id);
    res.json({success: "deleted"});
}