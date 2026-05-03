# Book organizing app project
This app allows the user to organize and keep track of their books and reading progress.\
There are over 2m+ books to search through and which can be added. 
\
The dataset we used can be found [here](https://cseweb.ucsd.edu/~jmcauley/datasets/goodreads.html).

## Wireframes
<img width="1115" height="747" alt="Screenshot 2026-05-03 205512" src="https://github.com/user-attachments/assets/21645f09-e97f-46d1-ab81-0b8625c9d1a0" />
<img width="1102" height="712" alt="Screenshot 2026-05-03 205441" src="https://github.com/user-attachments/assets/e8587d6e-07ae-4997-b19a-ecda483a94d8" />
<img width="1116" height="752" alt="Screenshot 2026-05-03 205406" src="https://github.com/user-attachments/assets/e7f8d8f5-5a75-4228-bf66-10f0fc897b71" />
[Figma link](https://www.figma.com/design/P3XEqP4wRaiwMN9UNvBIit/kasutajaliides-raamatukogu?node-id=16-245&t=PhEGq9Cqn0OxstPB-0)

## Current features
- Search for books
- View info about a book
- Add books into your shelf & afterwards leave a review
- View your books in a shelf
- See statistics about your progress

## Planned features
- Settings
- Make things working & dynamic
- Books show up on your shelf

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
