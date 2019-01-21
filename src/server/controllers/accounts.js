const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const config = require('config');

const JWT_PRIVATE_KEY = config.get('jwtKey');

const usernameAndPasswordSchema = {
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9!"#$%&'()*+,-./:;<=>?@[\]^_{|}~]{3,40}$/).required(),
};

const createAccountSchema= Joi.object().keys({
  ...usernameAndPasswordSchema,
  emailAddress: Joi.string().email({ minDomainAtoms: 2 }).required(),
});

const authenticationSchema = Joi.object().keys({
  ...usernameAndPasswordSchema,
});

const buildClaims = (account, user) => ({
  account: { name: account.name },
  user: { name: user.name, id: user.id, emailAddress: user.emailAddress, roles: user.roles },
});

const buildJwt = (account, user, expiresIn) => {
  const claims = buildClaims(account, user);
  return jwt.sign(claims, JWT_PRIVATE_KEY, { expiresIn });
};

const buildCookieOptions = (expiresIn) => ({
  maxAge: expiresIn*1000,
  httpOnly: true,
  /* ...(config.util.getEnv('NODE_ENV') === 'production' ? { secure: true } : {}), */
});

const buildLoginCookie = (account, user) => {
  const expiresIn = 60 * 60 * 24;
  return {
    cookie: buildJwt(account, user, expiresIn),
    options: buildCookieOptions(expiresIn),
  };
};

const initItemController = ({ store }) => {
  const accountCollection = store.collections.account;
  const userCollection = store.collections.user;

  const create = async (req, res) => {
    try {
      const { error, value: { username, password, emailAddress } } = Joi.validate(req.body, createAccountSchema);
      if (error) throw Error(`Validation error: ${error.details[0].message}`);

      const passwordHash = bcrypt.hashSync(password, 12);
      const newUser = await userCollection.insert({ name: username, emailAddress, roles: ['user'] });
      await accountCollection.insert({ name: username, passwordHash, emailAddress, users: [{ id: newUser.id }] });

      res.status(201).send();
    } catch (err) {
      console.error('Account creation failure:', err.message);
      res.status(400).send(err.message);
    }
  };

  const authenticate = async (req, res) => {
    try {
      const { value: { username, password }, error } = Joi.validate(req.body, authenticationSchema);
      if (error) throw Error(`Validation error: ${error.details[0].message}`);

      const account = await accountCollection.getByName(username);
      if (!account) throw Error(`No account found for account "${username}"`);

      const passwordMatches = bcrypt.compareSync(password, account.passwordHash);
      if (!passwordMatches) throw Error(`Incorrect password match for account "${username}"`);

      const userId = account.users[0].id;
      const user = await userCollection.getById(userId);
      if (!user) throw Error(`No user found with id "${userId}"`);

      const { cookie, options } = buildLoginCookie(account, user);

      res.cookie('jwt', cookie, options);
      res.status(200).send();
    } catch (err) {
      console.error('Authentication Failure:', err.message);
      res.status(401).send('Authentication failed');
    }
  };


  const profile = async (req, res) => {
    try {
      /* const headers = req.headers.cookie

       * const account = await accountCollection.getByName(username);
       * if (!account) throw Error(`No account found for account "${username}"`);
       * const user = await userCollection.getById(userId);
       * if (!user) throw Error(`No user found with id "${userId}"`);

       * const { cookie, options } = buildLoginCookie(account, user); */
      res.send(JSON.stringify(req.jwt));
    } catch (err) {
      console.error('Authentication Failure:', err.message);
      res.status(401).send('Authentication failed');
    }
  };

  return {
    create,
    authenticate,
    profile,
  };
};

module.exports = initItemController;
