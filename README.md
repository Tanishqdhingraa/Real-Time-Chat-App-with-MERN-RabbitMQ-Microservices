# Real-Time Chat App (MERN + Microservices)

A production-ready **Real-Time Chat Application** built using the **MERN stack**, **Microservices Architecture**, **RabbitMQ**, **Redis**, **Socket.IO**, and deployed on **AWS**. This project is designed for scalability, performance, and real-world use cases.

---

## 🚀 Features

* **Real-time messaging** with Socket.IO
* **Microservices architecture** for scalability
* **RabbitMQ Message Broker** for service communication
* **Redis** for caching, sessions, and rate-limiting
* **User Authentication** (JWT)
* **Chat Rooms & Private Chats**
* **MongoDB** for storing user and chat data
* **Dockerized services**
* **Production deployment on AWS** (EC2 + Load Balancer)

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* Redux Toolkit
* Tailwind CSS
* Socket.IO Client

### **Backend**

* Node.js & Express.js
* MongoDB + Mongoose
* Socket.IO
* Redis
* RabbitMQ
* JWT Authentication
* Docker

### **DevOps / Cloud**

* AWS EC2
* Nginx
* PM2
* Docker Compose

---

## 🧱 Microservices Used

* **Auth Service** – Login, Register, Token
* **Chat Service** – Chat rooms, message handling
* **Notification Service** – Push notifications (RabbitMQ)
* **Gateway / API Gateway** – Single entry point


## ⚙️ Installation & Setup

### **1️⃣ Clone the Repository**

```bash
git clone https://github.com/your-username/realtime-chatapp.git
cd realtime-chatapp
```

### **2️⃣ Install Dependencies**

Each service has its own dependencies:

```bash
cd auth-service && npm install
cd chat-service && npm install
cd notification-service && npm install
cd api-gateway && npm install
cd frontend && npm install
```

### **3️⃣ Start With Docker**

```bash
docker-compose up --build
```

---

## 🔌 Running Without Docker

Start each service manually:

```bash
cd auth-service && npm start
cd chat-service && npm start
cd notification-service && npm start
cd api-gateway && npm start
cd frontend && npm run dev
```

---

## 🐇 RabbitMQ Setup

Default local setup:

```
localhost:5672
user: guest
password: guest
```

Queues:

* message_events
* chat_notifications

---

## 🏗️ Deployment (AWS)

* Deploy backend services using **EC2 + PM2**
* Reverse proxy using **Nginx**
* Docker images stored in **Amazon ECR**
* MongoDB Atlas for database
* Redis on AWS ElastiCache or EC2
* HTTPS enabled with Certbot

---

## 📌 API Endpoints (Sample)

### **Auth**

```
POST /auth/register
POST /auth/login
```

### **Chat**

```
POST /chat/create-room
POST /chat/send-message
GET /chat/messages/:id
```

---

## 📡 WebSocket Events

### **Client → Server**

* `join_room`
* `send_message`

### **Server → Client**

* `receive_message`
* `user_online`
* `user_typing`

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📜 License

MIT License.

---

## ⭐ Show Support

If you like this project, star the repo!
