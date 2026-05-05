CREATE DATABASE IF NOT EXISTS auto_grading;
USE auto_grading;

DELETE FROM submission;
DELETE FROM question;
DELETE FROM users;

INSERT INTO users (id, name, email, password, role)
VALUES
(1, 'Teacher', 'teacher@gmail.com', '1234', 'TEACHER'),
(2, 'Student', 'student@gmail.com', '1234', 'STUDENT');

INSERT INTO question (id, question_text, model_answer, max_marks)
VALUES
(1, 'What is Java?', 'Java is a programming language.', 10);

INSERT INTO submission (student_id, question_id, student_answer, ai_marks, feedback)
VALUES
(2, 1, 'Java is a programming language', 8, 'Good answer');

SELECT * FROM users;
SELECT * FROM question;
SELECT * FROM submission;