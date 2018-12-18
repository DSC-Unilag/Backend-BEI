
CREATE TABLE users(
    id serial primary KEY,
    author VARCHAR(255),
    created_at TIMESTAMP not null DEFAULT current_timestamp
);
CREATE TABLE questions(
    id serial PRIMARY KEY,
    author VARCHAR(255),
    content text,
<<<<<<< HEAD
    user_id INTEGER REFERENCES users(id) on DELETE CASCADE
=======
    user_id INTEGER REFERENCES users(id)
>>>>>>> 3bfe20c08e5a33276775223db5a5c25035c5ba87
);
CREATE TABLE comments(
    id serial PRIMARY KEY,
    author VARCHAR(255),
<<<<<<< HEAD
    user_id INTEGER REFERENCES users(id) on delete cascade,
=======
    user_id INTEGER REFERENCES users(id),
>>>>>>> 3bfe20c08e5a33276775223db5a5c25035c5ba87
    question_id INTEGER REFERENCES questions(id) on delete cascade,
    content text,
    acceptable boolean DEFAULT false
);
CREATE TABLE replies(
    id serial PRIMARY KEY,
    author VARCHAR(255),
    content text,
<<<<<<< HEAD
    user_id INTEGER REFERENCES users(id) on delete cascade,
=======
    user_id INTEGER REFERENCES users(id),
>>>>>>> 3bfe20c08e5a33276775223db5a5c25035c5ba87
    question_id INTEGER REFERENCES questions(id) on delete cascade,
    comment_id INTEGER REFERENCES comments(id) on DELETE CASCADE
);