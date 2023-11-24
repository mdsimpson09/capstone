// src/controllers/MatchController.js
const pool = require('../config/config');
const matchQueries = require('../db/matchQueries');

const MatchController = {
  likeProfile: async (req, res) => {
    const { player_id: likerId } = req.user; // Assuming you have user information in the request

    try {
      const likedPlayerId = req.params.id;

      await matchQueries.saveLike(likerId, likedPlayerId);

      res.status(201).json({ message: 'Profile liked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error liking profile');
    }
  },

  dislikeProfile: async (req, res) => {
    const { player_id: dislikerId } = req.user;

    try {
      const dislikedPlayerId = req.params.id;

      await matchQueries.saveDislike(dislikerId, dislikedPlayerId);

      res.status(200).json({ message: 'Profile disliked successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error disliking profile');
    }
  },

  getMatches: async (req, res) => {
    const userId = req.user.player_id; // Assuming you have user information in the request

    try {
      const matches = await matchQueries.getMatchesByUserId(userId);

      res.status(200).json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching matches');
    }
  },
};

module.exports = MatchController;