# Password Manager Backend

A Node.js Express API server for the Password Manager application, providing secure password storage and management capabilities.

## Features

- RESTful API endpoints for password management
- MongoDB integration for data persistence
- Input validation and error handling
- CORS configuration for frontend integration
- Health check endpoint for monitoring
- Graceful shutdown handling
- Request logging middleware

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd password-manager/backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/password_manager_mongo
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**:
   Make sure MongoDB is running on your system:
   ```bash
   # On Windows (if installed as service)
   net start MongoDB
   
   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb/brew/mongodb-community
   ```

## Usage

### Development Mode
```bash
npm run dev
```
This starts the server with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm start
```

### Testing the API
```bash
node test-api.js
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/passwords` | Get all password entries |
| POST | `/passwords` | Create a new password entry |
| PUT | `/passwords/:id` | Update a password entry |
| DELETE | `/passwords/:id` | Delete a password entry |

For detailed API documentation, see [API.md](./API.md).

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/password_manager_mongo` |
| `PORT` | Server port | `5000` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

### CORS Configuration

The server is configured to accept requests from the frontend URL specified in the `FRONTEND_URL` environment variable. In development, this is typically `http://localhost:3000`.

## Database Schema

### Password Entry
```javascript
{
  _id: ObjectId,
  site: String,        // Website name or URL
  username: String,    // Username or email
  password: String,    // Password (stored in plain text)
  createdAt: Date,     // Creation timestamp
  updatedAt: Date      // Last update timestamp
}
```

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request**: Invalid input data or malformed requests
- **404 Not Found**: Resource not found or invalid endpoints
- **500 Internal Server Error**: Server errors and database connection issues

All errors return JSON responses with descriptive error messages.

## Security Considerations

⚠️ **Important Security Notes**:

1. **No Authentication**: This API currently has no authentication/authorization
2. **Plain Text Passwords**: Passwords are stored in plain text in the database
3. **Local Development**: CORS is configured for local development only

### For Production Use:

1. Implement proper authentication (JWT tokens, session management)
2. Add password encryption/hashing
3. Use HTTPS
4. Implement rate limiting
5. Add input sanitization
6. Configure proper CORS policies
7. Add logging and monitoring
8. Use environment-specific configurations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   ```
   MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
   ```
   - Ensure MongoDB is running
   - Check the `MONGO_URI` in your `.env` file
   - Verify MongoDB is listening on the correct port

2. **Port Already in Use**:
   ```
   Error: listen EADDRINUSE: address already in use :::5000
   ```
   - Change the `PORT` in your `.env` file
   - Or kill the process using the port: `lsof -ti:5000 | xargs kill`

3. **CORS Error**:
   ```
   Access to fetch at 'http://localhost:5000/api/passwords' from origin 'http://localhost:3000' has been blocked by CORS policy
   ```
   - Check the `FRONTEND_URL` in your `.env` file
   - Ensure the frontend is running on the specified URL

4. **Module Not Found**:
   ```
   Error: Cannot find module 'express'
   ```
   - Run `npm install` to install dependencies
   - Check your `package.json` file

### Debugging

1. **Enable verbose logging**:
   The server logs all requests with timestamps. Check the console output for request details.

2. **Test endpoints manually**:
   Use tools like Postman, curl, or the included test script to verify API functionality.

3. **Check MongoDB data**:
   ```bash
   mongosh
   use password_manager_mongo
   db.passwords.find()
   ```

## Development

### Project Structure
```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── API.md            # API documentation
├── README.md         # This file
└── test-api.js       # API test script
```

### Adding New Features

1. **New Endpoints**: Add routes in `server.js`
2. **Middleware**: Add custom middleware before route definitions
3. **Validation**: Extend input validation in route handlers
4. **Database**: Add new collections or modify schema as needed

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Update documentation
4. Test new features thoroughly
5. Consider security implications

## License

This project is licensed under the ISC License - see the `package.json` file for details.
