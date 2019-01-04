const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const config = require('config');

const newAccountSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
  emailAddress: Joi.string().email({ minDomainAtoms: 2 }).required(),
});

const initItemController = ({ store }) => {
  const accountCollection = store.collections.account;
  const userCollection = store.collections.user;

  const create = async (req, res) => {
    try {
      const { error, value: { username, password, emailAddress } } = Joi.validate(req.body, newAccountSchema);
      if (error) throw Error(`Validation error: ${error.details[0].message}`);

      const newUser = await userCollection.insert({ name: username, emailAddress });
      const passwordHash = bcrypt.hashSync(password, 12);
      await accountCollection.insert({ name: username, passwordHash, emailAddress, users: [{ id: newUser.id }] });

      res.status(201).send();
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  const authenticate = async (req, res) => {
    try {
      const name = req.body.username;
      const password = req.body.password;

      const account = await accountCollection.getByName(name);
      if (!account) throw Error(`No account found for account "${name}"`);

      const passwordMatches = bcrypt.compareSync(password, account.passwordHash);
      if (!passwordMatches) throw Error(`Incorrect password match for account "${name}"`);

      const user = await userCollection.getById(account.users[0].id);

      const claims = {
        account: { name: account.name },
        user: { name: user.name, emailAddress: user.emailAddress, roles: user.roles },
      };

      const expiresIn = 60 * 60 * 24;
      const token = jwt.sign(claims, config.get('jwtKey'), { expiresIn });

      res.cookie('jwt', token, { secure: true, httpOnly: true, maxAge: expiresIn });
      res.status(200).send(token);
    } catch (err) {
      res.status(401).send('Authentication failed');
    }
  };

  return {
    create,
    authenticate,
  };
};

module.exports = initItemController;
