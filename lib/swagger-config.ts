import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pennywhistle Pizza Ordering API - Swivel',
      version: '1.0.0',
      description: 'this is the swagger documentation for Pennywhistle Pizza Ordering API - Swivel',
    },
    servers: [
      {
        hostUrl: 'https://pennywhistle-pizza-swivel-api.onrender.com/api',
        localUrl: 'http://localhost:4000/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: [ './modules/*/*.route.ts' ],
};


const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
