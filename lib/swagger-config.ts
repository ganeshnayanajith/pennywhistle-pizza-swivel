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
        url: 'http://localhost:4000/api',
      },
    ],
  },
  apis: [ './modules/*/*.route.ts' ],
};


const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
