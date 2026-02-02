# SahyogFarm Backend - Required Dependencies

This document lists all external libraries and dependencies required for the backend application.

## Installation

Run the following command to install all dependencies:

```bash
npm install
```

## Production Dependencies

### Core Framework
- **express** (^5.2.1) - Fast, minimalist web framework for Node.js
- **mongoose** (^8.0.0) - MongoDB object modeling tool

### Authentication & Security
- **jsonwebtoken** (^9.0.2) - JSON Web Token implementation for authentication
- **bcryptjs** (^2.4.3) - Library to hash and compare passwords
- **helmet** (^7.1.0) - Helps secure Express apps with various HTTP headers
- **cors** (^2.8.5) - Enable Cross-Origin Resource Sharing

### Validation & Rate Limiting
- **express-validator** (^7.0.1) - Express middleware for request validation
- **express-rate-limit** (^7.1.5) - Rate limiting middleware to prevent abuse

### Image Upload
- **cloudinary** (^1.41.0) - Cloud storage service for image uploads

### Utilities
- **dotenv** (^16.3.1) - Load environment variables from .env file
- **morgan** (^1.10.0) - HTTP request logger middleware

### API Documentation
- **swagger-jsdoc** (^6.2.8) - Generate Swagger/OpenAPI specification from JSDoc comments
- **swagger-ui-express** (^5.0.0) - Serve Swagger UI for API testing and documentation

## Development Dependencies

- **nodemon** (^3.0.2) - Automatically restart server on file changes (hot reloading)
- **pm2** (^5.3.0) - Advanced production process manager with auto-restart, clustering, and monitoring

## Installation Steps

1. **Install all dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Install only production dependencies** (for production server):
   ```bash
   npm install --production
   ```

3. **Install specific dependency**:
   ```bash
   npm install <package-name>
   ```

## Environment Setup

After installing dependencies, create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then configure your environment variables (MongoDB URI, JWT secret, etc.)

## Running the Application

### Development Mode (with hot reloading)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Admin User
```bash
npm run seed
```

## Minimum Node.js Version

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

Check your version:
```bash
node --version
npm --version
```

## Alternative: Using Yarn

If you prefer Yarn package manager:

```bash
yarn install          # Install dependencies
yarn dev              # Development mode
yarn start            # Production mode
yarn seed             # Seed admin
```

## Notes

- All dependencies are specified in `package.json`
- Version numbers use semver (^) for minor updates
- Development dependencies are only needed during development
- Cloudinary is used for image uploads (can be replaced with AWS S3 if needed)

## Troubleshooting

If you encounter installation errors:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete node_modules and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Update npm**:
   ```bash
   npm install -g npm@latest
   ```

4. **Check Node.js version**:
   Make sure you're using Node.js 18 or higher
