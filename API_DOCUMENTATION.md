# SahyogFarm Backend API Documentation

Complete API specification for SahyogFarm tractor marketplace backend.

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.sahyogfarm.com/api
```

## Authentication
All admin endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": { ... },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [...],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### POST /api/auth/login
Login admin user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@sahyogfarm.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
      "email": "admin@sahyogfarm.com",
      "name": "Admin",
      "role": "admin",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account deactivated

**Rate Limit:** 5 requests per 15 minutes

---

### GET /api/auth/me
Get current authenticated user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e1",
      "email": "admin@sahyogfarm.com",
      "name": "Admin",
      "role": "admin",
      "lastLogin": "2026-02-01T10:00:00.000Z",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid/expired token

---

### POST /api/auth/logout
Logout user (client removes token).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": {},
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

### POST /api/auth/refresh
Refresh JWT token.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

## Public Product Endpoints

### GET /api/products
Get all available products (status = 'available').

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": {
    "products": [
      {
        "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
        "title": "Mahindra 575 DI",
        "description": "Reliable tractor for everyday farming needs.",
        "images": [
          "https://res.cloudinary.com/sahyogfarm/image/upload/v1/products/img1.jpg",
          "https://res.cloudinary.com/sahyogfarm/image/upload/v1/products/img2.jpg"
        ],
        "year": 2020,
        "price": 450000,
        "status": "available",
        "createdAt": "2024-01-15T10:00:00.000Z",
        "updatedAt": "2024-01-15T10:00:00.000Z"
      }
    ],
    "count": 10
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

### GET /api/products/:id
Get single product by ID (only if available).

**URL Parameters:**
- `id` (string, required) - Product ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
      "title": "Mahindra 575 DI",
      "description": "Reliable tractor...",
      "images": ["..."],
      "year": 2020,
      "price": 450000,
      "status": "available",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Product not found or not available

---

## Admin Product Endpoints

All admin endpoints require authentication.

### GET /api/admin/products
Get all products with filters and pagination.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status` (string, optional) - Filter by status: 'available', 'sold', 'all' (default: 'all')
- `search` (string, optional) - Search by title
- `page` (integer, optional) - Page number (default: 1)
- `limit` (integer, optional) - Items per page (default: 20, max: 100)

**Example Request:**
```
GET /api/admin/products?status=available&search=mahindra&page=1&limit=20
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
      "title": "Mahindra 575 DI",
      "description": "Reliable tractor...",
      "images": ["..."],
      "year": 2020,
      "price": 450000,
      "status": "available",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "stats": {
      "total": 15,
      "available": 10,
      "sold": 5,
      "recent": 3
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

### GET /api/admin/products/stats
Get product statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "stats": {
      "total": 15,
      "available": 10,
      "sold": 5,
      "recent": 3
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

---

### GET /api/admin/products/:id
Get single product by ID (admin view - includes sold products).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` (string, required) - Product ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "product": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
      "title": "Mahindra 575 DI",
      "description": "Reliable tractor...",
      "images": ["..."],
      "year": 2020,
      "price": 450000,
      "status": "available",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `400 Bad Request`: Invalid product ID format

---

### POST /api/admin/products
Create new product.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Mahindra 575 DI",
  "description": "Reliable tractor for everyday farming needs. Well-maintained and ready to work.",
  "images": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  ],
  "year": 2020,
  "price": 450000,
  "status": "available"
}
```

**Field Requirements:**
- `title` (string, required) - 3-200 characters
- `description` (string, required) - 10-2000 characters
- `images` (array, required) - 1-10 base64 encoded images or URLs
- `year` (number, required) - 1950 to current year + 1
- `price` (number, optional) - Positive number
- `status` (string, optional) - 'available' or 'sold' (default: 'available')

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e3",
      "title": "Mahindra 575 DI",
      "description": "Reliable tractor...",
      "images": [
        "https://res.cloudinary.com/sahyogfarm/image/upload/v1/products/img1.jpg"
      ],
      "year": 2020,
      "price": 450000,
      "status": "available",
      "createdAt": "2026-02-01T10:00:00.000Z",
      "updatedAt": "2026-02-01T10:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T10:00:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request`: Validation errors
- `413 Payload Too Large`: Image size exceeds limit

**Rate Limit:** 20 requests per hour

---

### PUT /api/admin/products/:id
Update existing product.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - Product ID

**Request Body:** (All fields optional - partial update supported)
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "images": [
    "https://res.cloudinary.com/sahyogfarm/image/upload/v1/products/existing.jpg",
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA..."
  ],
  "year": 2021,
  "price": 480000,
  "status": "available"
}
```

**Notes:**
- Images array can contain existing URLs and new base64 images
- Backend uploads base64 images and replaces with hosted URLs
- Only provided fields are updated

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "product": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
      "title": "Updated Title",
      "description": "Updated description",
      "images": ["..."],
      "year": 2021,
      "price": 480000,
      "status": "available",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2026-02-01T15:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T15:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `400 Bad Request`: Validation errors

**Rate Limit:** 20 requests per hour

---

### PATCH /api/admin/products/:id/status
Toggle product status between 'available' and 'sold'.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**URL Parameters:**
- `id` (string, required) - Product ID

**Request Body:**
```json
{
  "status": "sold"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product status updated successfully",
  "data": {
    "product": {
      "_id": "65f1b2c3d4e5f6a7b8c9d0e2",
      "title": "Mahindra 575 DI",
      "description": "Reliable tractor...",
      "images": ["..."],
      "year": 2020,
      "price": 450000,
      "status": "sold",
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2026-02-01T16:00:00.000Z"
    }
  },
  "timestamp": "2026-02-01T16:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `400 Bad Request`: Invalid status value

---

### DELETE /api/admin/products/:id
Delete product (soft delete).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**URL Parameters:**
- `id` (string, required) - Product ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "deletedId": "65f1b2c3d4e5f6a7b8c9d0e2"
  },
  "timestamp": "2026-02-01T17:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Product not found

**Notes:**
- Uses soft delete (sets deletedAt timestamp)
- Product remains in database but excluded from queries
- Can be restored by clearing deletedAt field

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INVALID_CREDENTIALS` | 401 | Invalid email or password |
| `NO_TOKEN` | 401 | No authentication token provided |
| `INVALID_TOKEN` | 401 | Token is invalid or malformed |
| `TOKEN_EXPIRED` | 401 | Token has expired |
| `USER_NOT_FOUND` | 401 | User associated with token not found |
| `NOT_AUTHENTICATED` | 401 | Authentication required |
| `ACCOUNT_DEACTIVATED` | 403 | User account is deactivated |
| `INSUFFICIENT_PERMISSIONS` | 403 | User lacks required permissions |
| `PRODUCT_NOT_FOUND` | 404 | Product not found |
| `NOT_FOUND` | 404 | Route not found |
| `USER_EXISTS` | 409 | User with email already exists |
| `DUPLICATE_ERROR` | 409 | Duplicate key error |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `POST /api/auth/login` | 5 requests | 15 minutes |
| `POST /api/admin/products` | 20 requests | 1 hour |
| `PUT /api/admin/products/:id` | 20 requests | 1 hour |
| All other `/api/*` endpoints | 100 requests | 15 minutes |

---

## Image Upload Specifications

### Accepted Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### Size Limits
- Maximum size per image: 5MB
- Maximum images per product: 10

### Upload Process
1. Frontend converts image to base64 using FileReader API
2. Backend receives base64 string
3. Backend validates format and size
4. Backend uploads to Cloudinary
5. Backend stores hosted URL in database
6. Cloudinary auto-optimizes and serves via CDN

### Base64 Format
```
data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBD...
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sahyogfarm.com",
    "password": "admin123"
  }'
```

### Get Products (Public)
```bash
curl http://localhost:5000/api/products
```

### Get Products (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Create Product
```bash
curl -X POST http://localhost:5000/api/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Tractor",
    "description": "Test description for tractor",
    "images": ["data:image/jpeg;base64,..."],
    "year": 2020,
    "price": 500000,
    "status": "available"
  }'
```

---

## Health Check

### GET /health
Check if server is running.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-01T10:00:00.000Z",
  "environment": "development"
}
```

---

**API Version:** 1.0  
**Last Updated:** February 1, 2026  
**Base URL:** http://localhost:5000/api
