import swaggerAutogen from 'swagger-autogen'

const doc = {
    info: {
        title: 'Delivery MS',
        description: 'App to deliver jokes',
    },
    host: '20.21.246.173',
    schemes: ['http'],
};

const outputFile = '../swagger.json';
const endpointsFiles = ['./app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen()(outputFile, endpointsFiles, doc);