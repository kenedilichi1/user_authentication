const express = require('express');
const server = express();
const router = require('./routes/routes_index')
const dbConnection = require('./controllers/signupController');

server.use(express.json());

server.use('/user', router);



module.exports = server