const config = require('config');
const _ = require( 'lodash');
const jwt = require( 'jsonwebtoken');

const JWT_PUBLIC_KEY = config.get('jwtKey');

const validateUserRoles = requiredRoles => (req, res, next) => {
  try{
    const [name, value] = req.headers.cookie.split(' ')[0].split('=');
    if(name !== 'jwt') throw Error('JWT not found');
    const decodedJwt = jwt.verify(value, JWT_PUBLIC_KEY);
    const userRoles = _.get(decodedJwt, 'user.roles') || [];
    const userHasAllRoles = requiredRoles.every(neededRole => userRoles.includes(neededRole));
    if (!userHasAllRoles) throw Error(`User ${jwt.user.id} does not have all roles ${requiredRoles.toString}`);
    req.jwt = decodedJwt;
    next();
  } catch (err) {
    res.status(401).send('Unauthorised');
    next(err);
  }
};

module.exports = {
  validateUserRoles,
};
