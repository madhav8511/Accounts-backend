const model = require("../model/bill")
const Bill = model.Bill

exports.getAllProduct = async(req,res)=>{
    const product = await Bill.find();
    res.json(product);
}

exports.addProduct = async(req,res)=>{
    const {name,price,quantity} = req.body;

    const oldProduct = await Bill.findOne({name: name});
    if(oldProduct) res.json({Signal: "Product Already Exist"});

    else
    {
        const Product = new Bill({name,price,quantity});
        await Product.save();
        res.json(Product)
    }
}

exports.updateProduct = async(req,res)=>{
    const { name, price, quantity } = req.body;

    const updatedProduct = await Bill.findOneAndUpdate(
    { name: name },
    { price: price, quantity: quantity },
    { new: true } 
    );

    res.json(updatedProduct);
}

exports.deleteProduct = async(req,res)=>{
    const product = await Bill.findByIdAndDelete(req.params.id);
    res.json({success:"Successfully Deleted"});
}

exports.deleteAll = async(req,res)=>{
    const response = await Bill.deleteMany();
    res.json({success: "All Deleted"});
}