
Tables:
1. Players:

player_id (Primary Key)
first_name
last_name
email (Unique)
password (Hashed and salted)
age
preferred_language
preferred_pronouns
zip_code
created_at
last_login


2. GamingPreferences:

player_id (Foreign Key referencing Players)
genre (Radio button format, store as text)
top_games (Array or separate table for top games)
preferred_devices (Radio button format, store as text)
preferred_distance (Single option format, store as text)
preferred_pronouns_of_matched (Radio button format, store as text)

3. LikedProfiles:

player_id (Foreign Key referencing Players)
liked_player_id (Foreign Key referencing Players)
liked_at