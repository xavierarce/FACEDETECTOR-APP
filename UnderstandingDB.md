SQL COMMANDS

<!-- Create database -->
CREATEDB users
<!-- Create Table -->
CREATE TABLE users (name text, age smallint, birthdate date);
<!-- Insert values -->
INSERT INTO users (name, age, birthdate) VALUES ('Sthefany',21,'2001-11-10');
<!-- Show table values -->
SELECT * FROM users;
<!-- Show table -->
\d
<!-- Add column to table -->
ALTER TABLE users ADD score smallint;
<!-- Update value -->
UPDATE users SET score = 50 WHERE name= 'Xavier';
<!-- Update Multiple Values -->
UPDATE users SET score = 100 WHERE name= 'Milena' OR name='Sthefany';
<!-- Select from words matching -->
SELECT * FROM users WHERE name LIKE 'A%';
<!-- Descending Order -->
SELECT * FROM users ORDER BY score DESC;
<!-- AVG Sum of column -->
SELECT AVG(score) FROM users;
test=# SELECT SUM(score) FROM users
test=# SELECT COUNT(score) FROM users;