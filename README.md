# 🏠 Real Estate Backend API

A robust backend API for a real estate application that supports user authentication, property management, and search functionality using ElasticSearch suggestions.

---

## 🌐 Deployment

**Backend Live URL:**  
[https://real-estate-backend-7pmw.onrender.com](https://real-estate-backend-7pmw.onrender.com)

**Frontend Live URL:**  
[https://real-estate-frontend-umber.vercel.app/](https://real-estate-frontend-umber.vercel.app/)

---

## 🔐 Test Credentials

### Admin
- **Username:** `goku@gmail.com`
- **Password:** `123456`

### User
- **Username:** `batman@gmail.com`
- **Password:** `123456`

---

## 📦 Tech Stack

- Node.js
- Express
- MongoDB
- JWT Authentication
- Role-based Authorization
- ElasticSearch (for auto-suggestions)

---
## 📦 .env variables

### JWT secret key for signing tokens
JWT_SECRET=your_jwt_secret_here

### MongoDB connection URI
MONGO_URI=your_mongodb_uri_here

### Server port
PORT=5000

### ElasticSearch configuration
ELASTICSEARCH_URL=https://your-elasticsearch-endpoint.com
ELASTIC_CLIENT_USERNAME=your_elastic_username
ELASTIC_CLIENT_PASSWORD=your_elastic_password

---

## 📘 API Endpoints

### 🧑‍💼 Auth Routes (`/api/auth`)

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| POST   | `/signup`        | Register new user      |
| POST   | `/login`         | Login user and receive token |

---

### 🏡 Property Routes (`/api/properties`)

#### 🔐 Auth Required (JWT token)

| Method | Endpoint             | Access         | Description                         |
|--------|----------------------|----------------|-------------------------------------|
| GET    | `/`                  | Authenticated  | Get all properties (with filters)   |
| GET    | `/suggest?input=...` | Authenticated  | Get keyword suggestions (Elastic)   |
| GET    | `/:id`               | Authenticated  | Get property by ID                  |
| POST   | `/`                  | Admin only     | Add new property                    |
| PUT    | `/:id`               | Admin only     | Update property by ID               |
| DELETE | `/:id`               | Admin only     | Delete property by ID               |

---

## 🔐 Authorization

All `/api/properties` routes require a **JWT token** in the `Authorization` header:


