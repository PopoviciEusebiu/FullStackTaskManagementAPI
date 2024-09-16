Full Stack Task Management Application
This project is a full-stack web application built using Spring Boot for the backend, React for the frontend, and MySQL as the database. The system supports two types of users: Administrator and User, each with different roles and permissions.

Features
1. User Roles: Administrator and User
Administrator:
Full CRUD operations on user management (create, read, update, delete).
Ability to view all tasks assigned to any user.
Perform CRUD operations on users' tasks.
User:
Can create, edit, and delete their own tasks.
Tasks are displayed in an integrated calendar view for easy tracking and management.
Can join groups with other users to share tasks and collaborate.
Can communicate with other users in the same group via a real-time chat using WebSocket technology.
2. Task Management
Users can manage tasks in a calendar format.
Tasks can be shared among group members, allowing collaboration on the same tasks.
Each user can:
Add new tasks.
Edit or delete existing tasks.
View tasks visually on a calendar for better organization.
3. Group Functionality
Users can join or create groups to share tasks with other members.
Members of the same group can collaborate on shared tasks.
Only group members have access to the group chat and task sharing.
4. Real-Time Chat
Users in the same group can communicate using a real-time chat powered by WebSocket.
Messages are only accessible by members of the group, ensuring privacy within the group.
5. User Authentication & Security
Spring Security is used for user authentication and authorization.
Role-based access control ensures that only Administrators can manage users, while Users can only manage their own tasks.
Registration process includes:
A secure user registration with email verification.
An email with a verification token is sent to the user, which must be confirmed to complete the registration process.
Login functionality with password encryption to protect user credentials.
6. Database
The application uses MySQL to store:
User information.
Tasks.
Group and chat data.
Role management (Administrator/User).
Relational database structure ensures data integrity and efficient querying.
Tech Stack
Backend: Spring Boot (Java)
RESTful APIs for communication between frontend and backend.
Spring Security for authentication and role-based authorization.
WebSocket for real-time chat functionality.
MySQL for database management.
Frontend: React.js
Responsive and dynamic user interface.
Task calendar integration for user task management.
Real-time group chat interface using WebSocket.
Database: MySQL
Stores all user, task, group, and chat data.
Deployment: Docker (optional)
Can be deployed using Docker containers for both backend and frontend components.
