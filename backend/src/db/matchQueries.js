// db/queries/matchQueries.js
const pool = require('../config/config');

const saveLike = async (likerId, likedPlayerId) => {
  const query = 'INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)';
  const values = [likerId, likedPlayerId];

  try {
    await pool.query(query, values);
  } catch (error) {
    throw error;
  }
};

const saveDislike = async (dislikerId, dislikedPlayerId) => {
  // Check if the profile has already been disliked
  const checkQuery =
    'SELECT * FROM LikedProfiles WHERE player_id = $1 AND liked_player_id = $2';
  const checkValues = [dislikerId, dislikedPlayerId];

  try {
    const checkResult = await pool.query(checkQuery, checkValues);

    if (checkResult.rows.length === 0) {
      // If the profile has not been disliked, save the dislike
      const saveQuery =
        'INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)';
      const saveValues = [dislikerId, dislikedPlayerId];

      await pool.query(saveQuery, saveValues);
    } else {
      // If the profile has already been disliked, you can handle it accordingly
      console.log('Profile already disliked');
    }
  } catch (error) {
    throw error;
  }
};

const getMatchesByUserId = async (userId) => {
  const query =
    'SELECT * FROM LikedProfiles lp JOIN Players p ON lp.liked_player_id = p.player_id WHERE lp.player_id = $1';
  const values = [userId];

  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  saveLike,
  saveDislike,
  getMatchesByUserId,
};