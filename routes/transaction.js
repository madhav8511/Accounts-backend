const express = require('express');
const userController = require('../controller/transaction');

const router = express.Router();
const decode = require('../middleware/trans');
const fetchuser = decode.fetchUser;

router
    .get('/',userController.getAlltransaction)
    .post('/createTransaction',fetchuser,userController.createTransaction)
    .get('/getbyUser',fetchuser,userController.getTransactionbyUser)
    .delete('/deletetrans/:id',userController.deleteTransactionbyUser);

exports.router = router;