CREATE TABLE IF NOT EXISTS Usuario (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    email VARCHAR(100) NOT NULL, 
    password VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    livro VARCHAR(100) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    sinopse VARCHAR(400),
    nota INT, 
    comentario VARCHAR(2500)
);
