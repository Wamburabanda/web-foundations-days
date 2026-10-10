# Library API - Books Resource
 
Base URL: https://api.citylibrary.org/v1
All requests and responses use JSON.
 
## Endpoints
 
### List all books
- GET /books
- Returns an array of books.
- Success: 200 OK
 
### List books by an author
- GET /books?author=Chinua%20Achebe
- Returns an array of books filtered by the author query parameter.
- Success: 200 OK

### Get one book
- GET /books/{id}
- Example: GET /books/15
- Returns a single book object by its ID.
- Success: 200 OK
 
### Create a book
- POST /books
- Body: `{ "title": "Things Fall Apart", "author": "Chinua Achebe", "year": 1958, "copies": 3 }`
- Success: 201 Created (returns the new book with its id)
 
### Update a book
- PATCH /books/{id}
- Body (only the fields to change): `{ "copies": 5 }`
- Success: 200 OK

### Delete a book
- DELETE /books/{id}
- Example: DELETE /books/15
- Deletes a specific book record.
- Success: 204 No Content

## Error Codes
- **400 Bad Request**: Happens when the client sends invalid JSON or missing required fields in a POST request.
- **404 Not Found**: Happens when the requested book ID does not exist in the database (e.g., trying to GET, PATCH, or DELETE a non-existent ID).
