\echo 'Delete and recreate jobly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gamer_date;
CREATE DATABASE gamer_date;
\connect gamer_date

\i gamer-schema.sql
\i data-seed.sql

\echo 'Delete and recreate gamer_date_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE gamer_date_test;
CREATE DATABASE gamer_date_test;
\connect gamer_date_test

\i gamer-schema.sql
