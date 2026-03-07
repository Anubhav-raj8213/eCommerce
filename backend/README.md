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
| POST   | `/refreshToken` | Refresh access token using refresh token |
| GET    | `/profile`  | Get current user profile |

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

### Products

**Base URL:** `/api/v1/products`

| Method | Endpoint       | Description | Access |
| :----- | :------------- | :---------- | :----- |
| GET    | `/`            | Get all products | Admin Only |
| GET    | `/featured`    | Get featured products | Public |
| POST   | `/addProduct`  | Add a new product | Admin Only |
| DELETE | `/:id`         | Delete a product | Admin Only |

#### 1. Get All Products
- **URL:** `/api/v1/products/`
- **Access:** Admin
- **Behavior:** Returns a list of all products in the database.

#### 2. Get Featured Products
- **URL:** `/api/v1/products/featured`
- **Access:** Public
- **Behavior:** Returns products marked as featured. Uses Redis caching for performance.

#### 3. Add Product
- **URL:** `/api/v1/products/addProduct`
- **Access:** Admin
- **Body:**
  ```json
  {
    "name": "Product Name",
    "desc": "Product Description",
    "price": 100,
    "category": "Electronics",
    "quantity": 10,
    "image": "base64_string_or_url"
  }
  ```
- **Behavior:** Uploads image to Cloudinary and saves product details to MongoDB.

#### 4. Delete Product
- **URL:** `/api/v1/products/:id`
- **Access:** Admin
- **Behavior:** Deletes the product from the database and removes its image from Cloudinary.