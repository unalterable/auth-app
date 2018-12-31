require('../../babel');
const setupRoutes = require('./routes.js');

const port = 3000;

setupRoutes()
  .listen(port, () => console.info(`App listening on port ${port}`));
