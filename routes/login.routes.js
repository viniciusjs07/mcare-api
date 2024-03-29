const express = require('express');
const router  = express.Router();
const login_controller = require('../controllers/login.controller');
const dotenv = require('dotenv-safe');
dotenv.load();

//Endpoints
router.post('/login', login_controller.login);

module.exports = router;
