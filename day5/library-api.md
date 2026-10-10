# Library REST API Design

Design specification for the library's `books` resource.

## Base URL
`https://api.librarysystem.com/v1`

---

## Endpoints

### 1. List All Books
* **Method:** `GET`
* **Path:** `/books`
* **Description:** Retrieves a list of all available books in the library.
* **Success Status Code:** `200 OK`

### 2. List Books by Author (Query Parameter)
* **Method:** `GET`
* **Path:** `/books?author=author_name`
* **Description:** Retrieves a filtered list of books written by a specific author.
* **Success Status Code:** `200 OK`

### 3. Get a Single Book
* **Method:** `GET`
* **Path:** `/books/{id}`
* **Description:** Retrieves details of a specific book by its unique ID.
* **Success Status Code:** `200 OK`

### 4. Create a New Book
* **Method:** `POST`
* **Path:** `/books`
* **Description:** Adds a new book record to the library database.
* **Example Request Body:**
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedYear": 2008,
    "isbn": "978-0132350884"
  }
