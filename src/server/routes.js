import express from 'express' ;
import bodyParser from 'body-parser';
import config from 'config';
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import initStore from './store';
import indexController from './controllers/index';
import initAccountsController from './controllers/accounts';

const JWT_PUBLIC_KEY = config.get('jwtKey');

const validateUserRole = role => (req, res, next) => {
  try{
    const [name, value] = req.headers.cookie.split(' ')[0].split('=');
    if(name !== 'jwt') throw Error('JWT not found');
    const decodedJwt = jwt.verify(value, JWT_PUBLIC_KEY);
    if(!(_.get(decodedJwt, 'user.roles') || []).includes(role)) throw Error('Role not found');
    req.jwt = decodedJwt;
    next();
  } catch (err) {
    next(err);
  }
  next();
};


const initRoutes = () => {
  const store = initStore();
  const accountsController = initAccountsController({ store });
  const app = express();
  app.use(bodyParser.json());

  app.use('/assets', express.static('assets'));

  app.put('/api/account/', accountsController.create);
  app.post('/api/authenticate/', accountsController.authenticate);
  app.get('/api/profile/', validateUserRole('sysadmin'), accountsController.profile);

  app.get('/*', indexController.showIndex);

  return app;
};

module.exports = initRoutes;
