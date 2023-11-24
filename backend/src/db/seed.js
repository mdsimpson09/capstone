const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const saltRounds = 12;

const { getDatabaseUri } = require('../config/config');

const pool = new Pool({
  connectionString: getDatabaseUri(),
});

const seedData = async () => {
  try {
    // Insert six players
    const players = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: await bcrypt.hash('password123', saltRounds),
        age: 25,
        preferred_pronouns: 'he/him',
        zip_code: '12345',
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: await bcrypt.hash('password456', saltRounds),
        age: 28,
        preferred_pronouns: 'she/her',
        zip_code: '54321',
      },
      {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        password: await bcrypt.hash('password789', saltRounds),
        age: 22,
        preferred_pronouns: 'she/her',
        zip_code: '67890',
      },
      {
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob.brown@example.com',
        password: await bcrypt.hash('passwordABC', saltRounds),
        age: 30,
        preferred_pronouns: 'he/him',
        zip_code: '98765',
      },
      {
        first_name: 'Eve',
        last_name: 'Williams',
        email: 'eve.williams@example.com',
        password: await bcrypt.hash('passwordXYZ', saltRounds),
        age: 26,
        preferred_pronouns: 'they/them',
        zip_code: '13579',
      },
      {
        first_name: 'Charlie',
        last_name: 'Davis',
        email: 'charlie.davis@example.com',
        password: await bcrypt.hash('password321', saltRounds),
        age: 32,
        preferred_pronouns: 'he/him',
        zip_code: '24680',
      },
    ];

    // Insert players into the Players table
    for (const player of players) {
      const { rows } = await pool.query(
        'INSERT INTO Players (first_name, last_name, email, password, age, preferred_pronouns, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING player_id',
        [
          player.first_name,
          player.last_name,
          player.email,
          player.password,
          player.age,
          player.preferred_pronouns,
          player.zip_code,
        ]
      );

      const playerId = rows[0].player_id;

      // Insert gaming preferences
      await pool.query(
        'INSERT INTO GamingPreferences (player_id, genre, top_games, preferred_devices) VALUES ($1, $2, $3, $4)',
        [playerId, 'Action', ['Game1', 'Game2', 'Game3'], 'PC']
      );
    }

    // Create liked profiles and matches
    const [john, jane, alice, bob, eve, charlie] = await Promise.all([
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['john.doe@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['jane.smith@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['alice.johnson@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['bob.brown@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['eve.williams@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['charlie.davis@example.com']),
    ]);

    await Promise.all([
      pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [john.rows[0].player_id, jane.rows[0].player_id]),
      pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [jane.rows[0].player_id, john.rows[0].player_id]),
      pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [eve.rows[0].player_id, charlie.rows[0].player_id]),
    ]);

    // Create dislikes
    const [aliceSelect, bobSelect] = await Promise.all([
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['alice.johnson@example.com']),
      pool.query('SELECT player_id FROM Players WHERE email = $1', ['bob.brown@example.com']),
    ]);

    await Promise.all([
      pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [aliceSelect.rows[0].player_id, john.rows[0].player_id]),
      pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [aliceSelect.rows[0].player_id, jane.rows[0].player_id]),
      pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [eve.rows[0].player_id, bob.rows[0].player_id]),
    ]);

    // Check for mutual likes and create matches
    const likedProfiles = await pool.query('SELECT * FROM LikedProfiles');
    const matchedProfiles = likedProfiles.rows.filter((like) => {
      const reverseLike = likedProfiles.rows.find(
        (reverse) => reverse.player_id === like.liked_player_id && reverse.liked_player_id === like.player_id
      );
      return reverseLike;
    });

    // Insert matched profiles into the "matchedprofiles" table
    for (const match of matchedProfiles) {
      await pool.query('INSERT INTO MatchedProfiles (player_id_1, player_id_2, matched_at) VALUES ($1, $2, $3)', [
        match.player_id,
        match.liked_player_id,
        new Date(),
      ]);
    }

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    pool.end();
  }
};

seedData();


// const seedData = async () => {
//   try {
//     // Insert four players
//     const players = [
//       {
//         first_name: 'John',
//         last_name: 'Doe',
//         email: 'john.doe@example.com',
//         password: await bcrypt.hash('password123', saltRounds),
//         age: 25,
//         preferred_pronouns: 'he/him',
//         zip_code: '12345',
//       },
//       {
//         first_name: 'Jane',
//         last_name: 'Smith',
//         email: 'jane.smith@example.com',
//         password: await bcrypt.hash('password456', saltRounds),
//         age: 28,
//         preferred_pronouns: 'she/her',
//         zip_code: '54321',
//       },
//       {
//         first_name: 'Alice',
//         last_name: 'Johnson',
//         email: 'alice.johnson@example.com',
//         password: await bcrypt.hash('password789', saltRounds),
//         age: 22,
//         preferred_pronouns: 'she/her',
//         zip_code: '67890',
//       },
//       {
//         first_name: 'Bob',
//         last_name: 'Brown',
//         email: 'bob.brown@example.com',
//         password: await bcrypt.hash('passwordABC', saltRounds),
//         age: 30,
//         preferred_pronouns: 'he/him',
//         zip_code: '98765',
//       },
//     ];

//     // Insert players into the Players table
//     for (const player of players) {
//       const { rows } = await pool.query(
//         'INSERT INTO Players (first_name, last_name, email, password, age, preferred_pronouns, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING player_id',
//         [
//           player.first_name,
//           player.last_name,
//           player.email,
//           player.password,
//           player.age,
//           player.preferred_pronouns,
//           player.zip_code,
//         ]
//       );

//       const playerId = rows[0].player_id;

//       // Insert gaming preferences
//       await pool.query(
//         'INSERT INTO GamingPreferences (player_id, genre, top_games, preferred_devices) VALUES ($1, $2, $3, $4)',
//         [playerId, 'Action', ['Game1', 'Game2', 'Game3'], 'PC']
//       );
//     }

//      // Create liked profiles
//      const [john, jane, aliceSelect, bobSelect] = await Promise.all([
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['john.doe@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['jane.smith@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['alice.johnson@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['bob.brown@example.com']),
//     ]);
    
//     await Promise.all([
//       pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [john.rows[0].player_id, jane.rows[0].player_id]),
//       pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [jane.rows[0].player_id, john.rows[0].player_id]),
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [aliceSelect.rows[0].player_id, john.rows[0].player_id]),
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [aliceSelect.rows[0].player_id, jane.rows[0].player_id]),
//     ]);

//     // Check for mutual likes and create matches
//     const likedProfiles = await pool.query('SELECT * FROM LikedProfiles');
//     const matchedProfiles = likedProfiles.rows.filter((like) => {
//       const reverseLike = likedProfiles.rows.find(
//         (reverse) => reverse.player_id === like.liked_player_id && reverse.liked_player_id === like.player_id
//       );
//       return reverseLike;
//     });

//     // Insert matched profiles into the "matchedprofiles" table
//     for (const match of matchedProfiles) {
//       await pool.query('INSERT INTO MatchedProfiles (player_id_1, player_id_2, matched_at) VALUES ($1, $2, $3)', [
//         match.player_id,
//         match.liked_player_id,
//         new Date(),
//       ]);
//     }


//     // // Create a match
//     // const [john, jane] = await Promise.all([
//     //   pool.query('SELECT player_id FROM Players WHERE email = $1', ['john.doe@example.com']),
//     //   pool.query('SELECT player_id FROM Players WHERE email = $1', ['jane.smith@example.com']),
//     // ]);

//     // await pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2), ($2, $1)', [john.rows[0].player_id, jane.rows[0].player_id]);

//     // Create dislikes
//     const [alice, bob] = await Promise.all([
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['alice.johnson@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['bob.brown@example.com']),
//     ]);

//     await Promise.all([
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [alice.rows[0].player_id, john.rows[0].player_id]),
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [alice.rows[0].player_id, jane.rows[0].player_id]),
//     ]);

//     console.log('Seed data inserted successfully.');
//   } catch (error) {
//     console.error('Error inserting seed data:', error);
//   } finally {
//     pool.end();
//   }
// };

// seedData();



// const { Pool } = require('pg');
// const { getDatabaseUri } = require('./config');

// const pool = new Pool({
//   connectionString: getDatabaseUri(),
// });

// const seedData = async () => {
//   try {
//     // Insert four players
//     const players = [
//       {
//         first_name: 'John',
//         last_name: 'Doe',
//         email: 'john.doe@example.com',
//         password: 'password123',
//         age: 25,
//         preferred_pronouns: 'he/him',
//         zip_code: '12345',
//       },
      


// //Player with a match
//       {
//         first_name: 'Jane',
//         last_name: 'Smith',
//         email: 'jane.smith@example.com',
//         password: 'password456',
//         age: 28,
//         preferred_pronouns: 'she/her',
//         zip_code: '54321',
//       },
//      // Player who has disliked two others
//       {
//         first_name: 'Alice',
//         last_name: 'Johnson',
//         email: 'alice.johnson@example.com',
//         password: 'password789',
//         age: 22,
//         preferred_pronouns: 'she/her',
//         zip_code: '67890',
//       },
//       {
//         first_name: 'Bob',
//         last_name: 'Brown',
//         email: 'bob.brown@example.com',
//         password: 'passwordABC',
//         age: 30,
//         preferred_pronouns: 'he/him',
//         zip_code: '98765',
//       },
//     ];

//     // Insert players into the Players table
//     for (const player of players) {
//       await pool.query(
//         'INSERT INTO Players (first_name, last_name, email, password, age, preferred_pronouns, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//         [
//           player.first_name,
//           player.last_name,
//           player.email,
//           player.password,
//           player.age,
//           player.preferred_pronouns,
//           player.zip_code,
//         ]
//       );
//     }

//    // Create a match
//     const [john, jane] = await Promise.all([
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['john.doe@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['jane.smith@example.com']),
//     ]);

//     await pool.query('INSERT INTO LikedProfiles (player_id, liked_player_id) VALUES ($1, $2)', [john.rows[0].player_id, jane.rows[0].player_id]);

//   // Create dislikes
//     const [alice, bob] = await Promise.all([
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['alice.johnson@example.com']),
//       pool.query('SELECT player_id FROM Players WHERE email = $1', ['bob.brown@example.com']),
//     ]);

//     await Promise.all([
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [alice.rows[0].player_id, john.rows[0].player_id]),
//       pool.query('INSERT INTO DislikedProfiles (player_id, disliked_player_id) VALUES ($1, $2)', [alice.rows[0].player_id, jane.rows[0].player_id]),
//     ]);

//     console.log('Seed data inserted successfully.');
//   } catch (error) {
//     console.error('Error inserting seed data:', error);
//   } finally {
//     pool.end();
//   }
// };

// seedData();