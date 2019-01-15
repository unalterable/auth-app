import express from 'express' ;
import bodyParser from 'body-parser';
import initStore from './store';
import indexController from './controllers/index';
import initAccountsController from './controllers/accounts';

const initRoutes = () => {
  const store = initStore();
  const accountsController = initAccountsController({ store });
  const app = express();
  app.use(bodyParser.json());

  app.use('/assets', express.static('assets'));

  app.put('/api/account/', accountsController.create);
  app.post('/api/authenticate/', accountsController.authenticate);
  app.get('/api/profile/', accountsController.profile);

  app.get('/*', indexController.showIndex);

  return app;
};

module.exports = initRoutes;
