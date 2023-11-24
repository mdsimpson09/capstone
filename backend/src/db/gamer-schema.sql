CREATE TABLE Players ( 
player_id SERIAL PRIMARY KEY, 
first_name VARCHAR(50) NOT NULL, 
last_name VARCHAR(50) NOT NULL, 
email VARCHAR(255) UNIQUE NOT NULL, 
password VARCHAR(255), 
age INT, 
preferred_pronouns VARCHAR(50), 
zip_code VARCHAR(5), 
created_at TIMESTAMP DEFAULT 
CURRENT_TIMESTAMP, last_login TIMESTAMP 
); 


CREATE TABLE DislikedProfiles (
  player_id INT,
  disliked_player_id INT,
  disliked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, disliked_player_id),
  FOREIGN KEY (player_id) REFERENCES Players(player_id),
  FOREIGN KEY (disliked_player_id) REFERENCES Players(player_id)
);

CREATE TABLE GamingPreferences (
  player_id INT PRIMARY KEY,
  genre VARCHAR(50),
  top_games VARCHAR(255),
  preferred_devices VARCHAR(100),
  preferred_distance VARCHAR(100),
  FOREIGN KEY (player_id) REFERENCES Players(player_id)
);

CREATE TABLE LikedProfiles (
  player_id INT,
  liked_player_id INT,
  liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, liked_player_id),
  FOREIGN KEY (player_id) REFERENCES Players(player_id),
  FOREIGN KEY (liked_player_id) REFERENCES Players(player_id)
);

CREATE TABLE MatchedProfiles (
  player_id_1 INT,
  player_id_2 INT,
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id_1, player_id_2),
  FOREIGN KEY (player_id_1) REFERENCES Players(player_id),
  FOREIGN KEY (player_id_2) REFERENCES Players(player_id)
);