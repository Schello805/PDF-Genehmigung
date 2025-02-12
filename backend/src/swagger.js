const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Digital Signature API',
      version: '1.0.0',
      description: 'API für die digitale Signatur von Dokumenten',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Document: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Document ID'
            },
            filename: {
              type: 'string',
              description: 'Name of the stored file'
            },
            originalName: {
              type: 'string',
              description: 'Original filename'
            },
            accessToken: {
              type: 'string',
              description: 'Unique access token for the document'
            },
            createdBy: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the creator'
                },
                email: {
                  type: 'string',
                  description: 'Email of the creator'
                }
              }
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'completed'],
              description: 'Current status of the document'
            },
            signatureFields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  x: {
                    type: 'number',
                    description: 'X position in percentage'
                  },
                  y: {
                    type: 'number',
                    description: 'Y position in percentage'
                  },
                  width: {
                    type: 'number',
                    description: 'Width in percentage'
                  },
                  height: {
                    type: 'number',
                    description: 'Height in percentage'
                  },
                  page: {
                    type: 'number',
                    description: 'Page number'
                  },
                  signedBy: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the signer'
                      },
                      email: {
                        type: 'string',
                        description: 'Email of the signer'
                      },
                      signature: {
                        type: 'string',
                        description: 'Base64 encoded signature image'
                      },
                      timestamp: {
                        type: 'string',
                        format: 'date-time',
                        description: 'Timestamp of signing'
                      }
                    }
                  }
                }
              }
            },
            auditLog: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  action: {
                    type: 'string',
                    description: 'Type of action performed'
                  },
                  performedBy: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the person who performed the action'
                      },
                      email: {
                        type: 'string',
                        description: 'Email of the person who performed the action'
                      }
                    }
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    description: 'When the action was performed'
                  },
                  details: {
                    type: 'string',
                    description: 'Additional details about the action'
                  }
                }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJSDoc(options);
