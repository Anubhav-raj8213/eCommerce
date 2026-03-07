# eCommerce Backend API

This is the backend API for an eCommerce application. It is built using Node.js, Express, MongoDB, and Redis. It currently features a robust authentication system using JWTs (Access & Refresh tokens) with Redis for session/token management.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Caching & Session Store:** Redis (ioredis)
- **Authentication:** JWT (JSON Web Tokens), bcrypt
- **Validation:** express-validator

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/) (Running locally on port 6379)

## Installation & Setup

1.  **Clone the repository** (or navigate to your project folder).

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    PORT=5000
    DB_URI=mongodb://localhost:27017/eCommerce-local
    JWT_SECRET=your_secure_jwt_secret
    REDIS_HOST=127.0.0.1
    REDIS_PORT=6379
    ```

4.  **Start the Server:**
    ```bash
    npm start
    # OR
    node server.js
    ```

## API Endpoints

### Authentication

**Base URL:** `/api/v1/auth`

| Method | Endpoint    | Description |
| :----- | :---------- | :---------- |
| POST   | `/register` | Register a new user |
| POST   | `/login`    | Login an existing user |
| POST   | `/logout`   | Logout user (Clears cookies & Redis cache) |

#### 1. Register
- **URL:** `/api/v1/auth/register`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Behavior:** Creates a user, generates tokens, stores the refresh token in Redis (7 days), and sets HTTP-only cookies.

#### 2. Login
- **URL:** `/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Behavior:** Validates credentials, generates new tokens, caches the refresh token in Redis, and sets cookies.

#### 3. Logout
- **URL:** `/api/v1/auth/logout`
- **Behavior:** Requires a valid `refreshToken` cookie. Removes the token from Redis and clears client cookies.