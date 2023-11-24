// src/controllers/UserController.js
const pool = require('../config/config');
const bcrypt = require('bcrypt');

const UserController = {
  registerUser: async (req, res) => {
    const {
      first_name,
      last_name,
      email,
      password,
      age,
      preferred_pronouns,
      zip_code,
    } = req.body;

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const query =
      'INSERT INTO Players (first_name, last_name, email, password, age, preferred_pronouns, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      age,
      preferred_language,
      preferred_pronouns,
      zip_code,
    ];

    try {
      const result = await pool.query(query, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error registering user');
    }
  },

  loginUser: async (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM Players WHERE email = $1';
    const values = [email];

    try {
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // You may want to generate and send a token for authentication

      res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;

    const query = 'SELECT * FROM Players WHERE player_id = $1';
    const values = [userId];

    try {
      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const user = result.rows[0];
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching user');
    }
  },
};

module.exports = UserController;