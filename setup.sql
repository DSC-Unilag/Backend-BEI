
CREATE TABLE users(
    id serial primary KEY,
    author VARCHAR(255),
    created_at TIMESTAMP not null DEFAULT current_timestamp
);
CREATE TABLE questions(
    id serial PRIMARY KEY,
    author VARCHAR(255),
    content text,
    user_id INTEGER REFERENCES users(id) on delete cascade
);
CREATE TABLE comments(
    id serial PRIMARY KEY,
    author VARCHAR(255),
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER REFERENCES questions(id) on delete cascade,
    content text,
    acceptable boolean DEFAULT false
);
CREATE TABLE replies(
    id serial PRIMARY KEY,
    author VARCHAR(255),
    content text,
    user_id INTEGER REFERENCES users(id),
    question_id INTEGER REFERENCES questions(id) on delete cascade,
    comment_id INTEGER REFERENCES comments(id) on DELETE CASCADE
);