const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const openApiSpec = YAML.load(path.join(__dirname, 'openapi.yaml'));

const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(openApiSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Widya Robotics API Documentation',
    })
  );
};

module.exports = setupSwagger;
