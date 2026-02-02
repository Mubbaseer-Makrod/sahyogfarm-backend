const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SahyogFarm API Documentation',
      version: '1.0.0',
      description: 'Complete REST API documentation for SahyogFarm tractor marketplace',
      contact: {
        name: 'SahyogFarm',
        email: 'info@sahyogfarm.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.sahyogfarm.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter ONLY the token (without "Bearer" prefix)'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID',
              example: '65f1b2c3d4e5f6a7b8c9d0e1'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'admin@sahyogfarm.com'
            },
            name: {
              type: 'string',
              description: 'User name',
              example: 'Admin'
            },
            role: {
              type: 'string',
              enum: ['admin'],
              description: 'User role',
              example: 'admin'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Product ID',
              example: '65f1b2c3d4e5f6a7b8c9d0e2'
            },
            title: {
              type: 'string',
              description: 'Product title',
              example: 'Mahindra 575 DI',
              minLength: 3,
              maxLength: 200
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'Reliable tractor for everyday farming needs.',
              minLength: 10,
              maxLength: 2000
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri'
              },
              description: 'Product image URLs',
              example: ['https://res.cloudinary.com/sahyogfarm/image/upload/v1/products/img1.jpg']
            },
            year: {
              type: 'integer',
              description: 'Manufacturing year',
              example: 2020,
              minimum: 1950,
              maximum: 2027
            },
            price: {
              type: 'number',
              description: 'Price in INR',
              example: 450000,
              minimum: 0
            },
            status: {
              type: 'string',
              enum: ['available', 'sold'],
              description: 'Product availability status',
              example: 'available'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp'
            }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['title', 'description', 'images', 'year'],
          properties: {
            title: {
              type: 'string',
              description: 'Product title',
              example: 'Mahindra 575 DI',
              minLength: 3,
              maxLength: 200
            },
            description: {
              type: 'string',
              description: 'Product description',
              example: 'Reliable tractor for everyday farming needs.',
              minLength: 10,
              maxLength: 2000
            },
            images: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of base64 encoded images or URLs',
              example: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...']
            },
            year: {
              type: 'integer',
              description: 'Manufacturing year',
              example: 2020
            },
            price: {
              type: 'number',
              description: 'Price in INR (optional)',
              example: 450000
            },
            status: {
              type: 'string',
              enum: ['available', 'sold'],
              description: 'Product status (default: available)',
              example: 'available'
            }
          }
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Admin email',
              example: 'admin@sahyogfarm.com'
            },
            password: {
              type: 'string',
              description: 'Admin password',
              example: 'admin123',
              minLength: 6
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success message'
            },
            data: {
              type: 'object'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Error Type'
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            code: {
              type: 'string',
              example: 'ERROR_CODE'
            },
            details: {
              type: 'object'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Success message'
            },
            data: {
              type: 'array',
              items: {
                type: 'object'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: {
                  type: 'integer',
                  example: 15
                },
                page: {
                  type: 'integer',
                  example: 1
                },
                limit: {
                  type: 'integer',
                  example: 20
                },
                totalPages: {
                  type: 'integer',
                  example: 1
                },
                stats: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    available: { type: 'integer' },
                    sold: { type: 'integer' },
                    recent: { type: 'integer' }
                  }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication endpoints'
      },
      {
        name: 'Public Products',
        description: 'Public product endpoints (no authentication required)'
      },
      {
        name: 'Admin Products',
        description: 'Admin product management endpoints (authentication required)'
      }
    ]
  },
  apis: ['./routes/*.js'] // Path to route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
