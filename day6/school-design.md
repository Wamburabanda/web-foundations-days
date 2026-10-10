# School Management System - Database Design

## Table Explanations
* **`students`**: Stores core information for each student registered in the system, including a unique identifier (`student_id`), full name, and a unique `email` address to prevent duplicate accounts.
* **`courses`**: Stores information about every course offered by the institution, including a unique identifier (`course_id`), the name of the course, and the instructor's name.
* **`enrolments`**: A junction (join) table that records the relationship between students and courses. It tracks which student is registered for which course, holds the grade achieved, and enforces a unique constraint preventing duplicate enrolments.

## Relationships & The Join Table
* **Relationships:** 
  * The relationship between `students` and `courses` is a **many-to-many** relationship (one student can take multiple courses, and one course can have multiple students).
* **Why a Join Table is Needed:** Relational databases cannot natively represent many-to-many relationships in a single table without data duplication. The `enrolments` table breaks the many-to-many relationship down into two manageable **one-to-many** relationships (`students` to `enrolments` and `courses` to `enrolments`). Furthermore, it is the appropriate location to store attributes that belong specifically to the *interaction* or *relationship* between a student and a course—namely, the student's **grade** and the uniqueness constraint preventing multiple identical enrolments.

## Recommended Index
* **Index Target:** `enrolments (student_id, course_id)`
* **Reason:** Because lookups, joins, and uniqueness verifications heavily query the mapping keys between students and courses (especially when validating duplicate registrations or retrieving a student's transcript history), indexing these foreign key columns optimizes search speed and improves join execution performance.

## Database Choice: SQL vs. NoSQL
For this school management system tracking students, courses, enrolments, and grades, **SQL (Relational Database)** is the definitive choice. School administration data is inherently structured and relational, requiring strict foreign key referential integrity, unique constraints, and aggregate reporting (such as student counts per course and grade updates). SQL guarantees ACID compliance, ensuring that records like student grades and class allocations remain consistent, secure, and free of orphaned entries. A NoSQL database would be overly unstructured and loose for a domain where structural consistency and strict relational integrity are essential.
