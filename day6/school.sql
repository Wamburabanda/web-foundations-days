-- Enable foreign key constraints in SQLite
PRAGMA foreign_keys = ON;

-- Drop tables if they already exist to allow clean re-runs
DROP TABLE IF EXISTS enrolments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;

-- 1. CREATE TABLE statements with constraints, primary keys, foreign keys, and unique rules
CREATE TABLE students (
    student_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE courses (
    course_id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT NOT NULL,
    instructor TEXT NOT NULL
);

CREATE TABLE enrolments (
    enrolment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    grade TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    -- Rule preventing the same student from enrolling on the same course twice
    CONSTRAINT unique_student_course UNIQUE (student_id, course_id)
);

-- 2. INSERT statements adding at least 3 students, 3 courses, and 5 enrolments
-- (Included a 4th student with no enrolments to test the LEFT JOIN requirement)
INSERT INTO students (name, email) VALUES 
    ('Alice Smith', 'alice@example.com'),
    ('Bob Jones', 'bob@example.com'),
    ('Charlie Brown', 'charlie@example.com'),
    ('Diana Prince', 'diana@example.com');

INSERT INTO courses (course_name, instructor) VALUES 
    ('Web Foundations', 'Dr. John Doe'),
    ('Database Management', 'Prof. Jane Smith'),
    ('Python Programming', 'Dr. Alan Turing');

INSERT INTO enrolments (student_id, course_id, grade) VALUES 
    (1, 1, 'A'),
    (1, 2, 'B+'),
    (2, 1, 'A-'),
    (3, 3, 'B'),
    (2, 3, 'A');

-- 3. THE FIVE REQUIRED QUERIES

-- Query 1: All courses for one student (by name)
SELECT c.course_name, c.instructor, e.grade
FROM courses c
JOIN enrolments e ON c.course_id = e.course_id
JOIN students s ON e.student_id = s.student_id
WHERE s.name = 'Alice Smith';

-- Query 2: All students on one course
SELECT s.name, s.email, e.grade
FROM students s
JOIN enrolments e ON s.student_id = e.student_id
JOIN courses c ON e.course_id = c.course_id
WHERE c.course_name = 'Web Foundations';

-- Query 3: The number of students per course (using GROUP BY and LEFT JOIN)
SELECT c.course_name, COUNT(e.student_id) AS student_count
FROM courses c
LEFT JOIN enrolments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name;

-- Query 4: Students who have no enrolments (using LEFT JOIN)
SELECT s.student_id, s.name, s.email
FROM students s
LEFT JOIN enrolments e ON s.student_id = e.student_id
WHERE e.enrolment_id IS NULL;

-- Query 5: Update of one enrolment's grade
UPDATE enrolments
SET grade = 'A+'
WHERE student_id = 1 AND course_id = 1;
