const express = require('express');
const userController = require('../controller/user');

const router = express.Router();

router
    .get('/',userController.getAlluser)
    .post('/createUser',userController.createUser)
    .delete('/deleteUser/:id',userController.deleteUser)
    .get('/getbycity',userController.getUserbyCity)
    .get('/verifyUser',userController.verifyUser);

exports.router = router;