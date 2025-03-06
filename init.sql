CREATE DATABASE IF NOT EXISTS forum_db;
USE forum_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (username, password_hash) VALUES ('admin', 'orOGuaoRz8DCr4zK+cEHcW6l3HPV1HTjJu4Qc+AQZoP3kj04ayVpHEBR7Naz41UZ1e+R9lVvd1JQPLaY+s8JlA==');

INSERT INTO posts (title, content, author_id, is_private) VALUES ('FLAG', '!@(*)df&#$@*$(@$$&&$5636sgsgd3636H(*H*F(H*(H(*H(qVHX3643463e45*%&%^%#@!&%^@#r$ee\\\||e|||eegq776574125347|||VXCKgrgrLLW:W::LWK\\\2345234||52d52355afcsdKEdRK||rQ424d2434JR@()@$dssg^^$%fdd#(!$@$68|s|6789$@!fqw$%)fgs)gr||)$ag84ss8dfd44fgdg552|$^6)74657|5725d23465|e445654)))', 1, 1);