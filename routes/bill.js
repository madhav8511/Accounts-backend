const express = require('express');
const billController = require('../controller/bill');

const router = express.Router();

router
    .get('/getproduct',billController.getAllProduct)
    .put('/updateproduct',billController.updateProduct)
    .delete('/deleteproduct/:id',billController.deleteProduct)
    .delete('/deleteAll',billController.deleteAll)
    .post('/addproduct',billController.addProduct);

exports.router = router;