# Password Manager Backend API Documentation

## Base URL
```
http://localhost:5000/api
```

## Endpoints

### Health Check
**GET** `/api/health`

Returns server status and uptime.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

### Authentication

#### Register User
**POST** `/api/auth/register`

Creates a new user.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully! You can now log in."
}
```

#### Login User
**POST** `/api/auth/login`

Logs in a user and returns a JWT token.

**Request Body:**
```json
{
  "identifier": "testuser",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "your-jwt-token",
  "message": "Login successful"
}
```

#### Forgot Password
**POST** `/api/auth/forgot-password`

Sends a password reset email to the user.

**Request Body:**
```json
{
  "email": "test@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent. Please check your inbox."
}
```

#### Reset Password
**POST** `/api/auth/reset-password`

Resets the user's password.

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully. You can now log in with your new password."
}
```

### Passwords

_All password routes require a valid JWT token in the `Authorization` header._

#### Get All Passwords
**GET** `/api/passwords`

Returns all stored password entries for the authenticated user.

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "site": "example.com",
    "username": "user@example.com",
    "password": "securepassword123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Create Password Entry
**POST** `/api/passwords`

Creates a new password entry for the authenticated user.

**Request Body:**
```json
{
  "site": "example.com",
  "username": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
The updated list of all passwords for the user.

#### Update Password Entry
**PUT** `/api/passwords/:id`

Updates an existing password entry for the authenticated user.

**Request Body:**
```json
{
  "site": "example.com",
  "username": "user@example.com",
  "password": "newsecurepassword123"
}
```

**Response:**
The updated list of all passwords for the user.

#### Delete Password Entry
**DELETE** `/api/passwords/:id`

Deletes a password entry for the authenticated user.

**Response:**
The updated list of all passwords for the user.

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid ID format"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Route not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to fetch passwords"
}
```

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/password_manager_mongo
   PORT=5000
   JWT_SECRET=your-jwt-secret
   EMAIL_HOST=your-email-host
   EMAIL_PORT=your-email-port
   EMAIL_USER=your-email-user
   EMAIL_PASSWORD=your-email-password
   EMAIL_FROM=your-email-from
   ```

3. Start MongoDB server

4. Run the application:
   ```bash
   npm start      # Production
   npm run dev    # Development with nodemon
   ```

## Security Considerations

- Passwords are hashed using bcrypt.
- Authentication is handled using JWT.
- CORS is configured for local development.
- Remember to use a strong `JWT_SECRET` in production.
