// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/:userId', UserController.getUserById);

module.exports = router;