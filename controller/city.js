let model = require('../model/city');
const City = model.City;

model = require('../model/user');
const User = model.User;

model = require('../model/transaction');
const Transaction = model.Transaction;

exports.getCity = async (req,res)=>{
    const city = await City.find();
    res.json(city);
}

exports.addCity = async (req,res)=>{
    let city = await City.findOne({name : req.body.name});
    if(!city){
        city = new City();
        city.name = req.body.name;
        await city.save();
        res.json({Success : "City added"});
    }
    else{
        res.send("Sorry a city with same name exist");
    }
}

exports.deleteCity = async (req,res)=>{
    let city = await City.findById(req.params.id);
    let users = await User.find({ address: city.name }); // Use plural 'users' to represent an array of users
    let userIds = users.map(user => user._id); // Extract user IDs from the array of users

    // Delete transactions associated with the users
    let transactions = await Transaction.deleteMany({ user: { $in: userIds } });

    // Delete users
    let deletedUsers = await User.deleteMany({ _id: { $in: userIds } }); // Use user IDs to delete users

    // Delete city
    let deletedCity = await City.findByIdAndDelete(req.params.id);

    res.json({ success: "Successfully deleted" });
}