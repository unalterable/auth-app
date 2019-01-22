import express from 'express' ;
import bodyParser from 'body-parser';
import initStore from './store';
import indexController from './controllers/index';
import initAccountsController from './controllers/accounts';
import { validateUserRoles } from '../server/middleware/index';

const initRoutes = () => {
  const store = initStore();
  const accountsController = initAccountsController({ store });
  const app = express();
  app.use(bodyParser.json());

  app.use('/auth/assets', express.static('assets'));

  app.put('/auth/api/account/', accountsController.create);
  app.post('/auth/api/authenticate/', accountsController.authenticate);
  app.get('/auth/api/profile/', validateUserRoles(['user']), accountsController.profile);

  app.get('/auth/*', indexController.showIndex);

  return app;
};

module.exports = initRoutes;
