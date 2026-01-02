# Real-Time Chat App with MERN & Microservices

A scalable **real-time chat application** built using **MERN stack (MongoDB, Express.js, React.js, Node.js)** and **microservices architecture** with **RabbitMQ** for messaging. The app supports authentication, OTP verification, email service, and real-time chatting via WebSockets.

---

## 🚀 Features

### User Service
- User registration & login
- OTP verification for sign-up/login
- JWT-based authentication
- Stores user information securely in MongoDB

### Mail Service
- Sends emails (OTP, notifications)
- Authenticated via SMTP/email service
- Works asynchronously with RabbitMQ

### Chat Service
- Real-time messaging using WebSockets (Socket.io)
- Stores chat history in MongoDB
- Supports one-to-one and group chats
- Updates latest message for each chat

### Other Features
- Microservices architecture for scalability
- Decoupled services communicate via RabbitMQ
- TypeScript with strict typing
- Docker-ready for deployment
- Error handling with centralized `TryCatch` utility

---

## 🏗️ Architecture



       +-----------------+
       |     Client      |
       |  (React Frontend) |
       +--------+--------+
                |
       -------------------
       | Web / REST API  |
       -------------------
        |             |
  +-----v-----+   +---v---+
  | UserSvc   |   | MailSvc|
  | (Auth)    |   | (Email)|
  +-----------+   +-------+
        |
        v
  +-----------+
  | ChatSvc   |
  | (WebSocket)|
  +-----------+

- **User Service:** Handles authentication, JWT, OTP
- **Mail Service:** Sends emails asynchronously via RabbitMQ
- **Chat Service:** Handles real-time chat messaging

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript, MongoDB
- **Frontend:** React.js (optional)
- **Messaging Queue:** RabbitMQ
- **Real-Time:** Socket.io
- **Authentication:** JWT, OTP
- **Dev Tools:** Nodemon, Docker

---

## 📁 Project Structure

cd Backend/user
npm install
cd ../chat
npm install
cd ../mail
npm install
📌 Author

Tanishq Dhingra
GitHub: https://github.com/Tanishqdhingraa
