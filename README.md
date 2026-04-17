# Book organizing app project
This app allows the user to organize and keep track of their books and reading progress.\
There are over 2m+ books to search through and which can be added.\ 
\
The dataset we used can be found [here](https://cseweb.ucsd.edu/~jmcauley/datasets/goodreads.html).

## Current features
TBD

## Requirements
- node.js v23 or higher
- Express
- bettersqlite-3

## How to install
1. Clone the repo using 'git clone https://github.com/StenReins/raamatukogu-app.git'
2. From the [datasets](https://cseweb.ucsd.edu/~jmcauley/datasets/goodreads.html), get the "Detailed book graph" dataset and "Detailed information of authors" dataset. Extract those json files into the "data" folder.
2. Run 'node data/books.json data/authors.json data/books.db' (change the names accordingly)
3. Wait for the database creation to finish.
4. Run 'node index.js'
5. Access the library app through "localhost:3000"
