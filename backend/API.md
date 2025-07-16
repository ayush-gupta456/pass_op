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

### Get All Passwords
**GET** `/api/passwords`

Returns all stored password entries.

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

### Create Password Entry
**POST** `/api/passwords`

Creates a new password entry.

**Request Body:**
```json
{
  "site": "example.com",
  "username": "user@example.com", 
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "id": "507f1f77bcf86cd799439011"
}
```

### Update Password Entry
**PUT** `/api/passwords/:id`

Updates an existing password entry.

**Request Body:**
```json
{
  "site": "example.com",
  "username": "user@example.com",
  "password": "newsecurepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "site": "example.com",
    "username": "user@example.com",
    "password": "newsecurepassword123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Delete Password Entry
**DELETE** `/api/passwords/:id`

Deletes a password entry.

**Response:**
```json
{
  "success": true,
  "message": "Password entry deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid ID format"
}
```

### 404 Not Found
```json
{
  "error": "Password entry not found"
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
   FRONTEND_URL=http://localhost:3000
   ```

3. Start MongoDB server

4. Run the application:
   ```bash
   npm start      # Production
   npm run dev    # Development with nodemon
   ```

## Security Considerations

- This API currently has no authentication/authorization
- All data is stored in plain text in MongoDB
- CORS is configured for localhost development
- Consider implementing proper encryption for passwords in production
