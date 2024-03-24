const express = require('express');
const cityController = require('../controller/city');

const router = express.Router();

router
    .get('/',cityController.getCity)
    .delete('/deletecity/:id',cityController.deleteCity)
    .post('/addcity',cityController.addCity);

exports.router = router;