import { Options } from 'swagger-jsdoc';
import { PORT } from '../../env';
const swaggerOptions: Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Chat API Documentation',
        version: '1.0.0',
        description: 'Documentation for your API built with Swagger.',
        contact: {
          name: 'João Souza',
          email: 'vitorkabuls@gmail.com',
          url: 'https://your-website.com',
        },
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Local development server',
        },
        // Add more servers if needed
      ],
    },
    apis: ['./src/routes/*.ts',"./src/swagger/documentation/*.ts"],
  };

export default swaggerOptions;