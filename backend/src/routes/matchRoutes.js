// src/routes/matchRoutes.js
const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');

router.post('/like', MatchController.likeProfile);
router.post('/dislike', MatchController.dislikeProfile);
router.get('/matches/:userId', MatchController.getMatches);

module.exports = router;