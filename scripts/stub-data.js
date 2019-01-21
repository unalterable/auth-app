const { MongoClient } = require('mongodb');
const config = require('config');

const url = config.get('db.mongo.url');
const db = config.get('db.mongo.dbName');

const devAccount1 = {
  name : 'devAdmin',
  passwordHash : '$2a$10$qxW8cEi6v/hZAmRjeQMkA.F3rkDn1qD8aurBeiNpInirzP0gKpFcy',
  emailAddress : 'admin@dev.com',
  users : [{ id : '11111111-1111-1111-1111-111111111112' }],
  id : '11111111-1111-1111-1111-111111111111',
};

const devUser1 = {
  name : 'devAdmin',
  emailAddress : 'bob@bob.com',
  id : '11111111-1111-1111-1111-111111111112',
  roles: ['sysAdmin', 'user'],
};

const devAccount2 = {
  name : 'devUser',
  passwordHash : '$2a$10$pNgRFKixq.VRy5SnUPGuROXMJwKWwlurb2ab9FMaZSGg6mJs9cniG',
  emailAddress : 'bob@bob.com',
  users : [{ id : '22222222-2222-2222-2222-222222222222' }],
  id : '22222222-2222-2222-2222-222222222221',
};

const devUser2 = {
  name : 'devUser',
  emailAddress : 'bob@bob.com',
  id : '22222222-2222-2222-2222-222222222222',
  roles: ['user'],
};

(async () => {
  const connection = await MongoClient.connect(url, { useNewUrlParser: true });
  const accounts = connection.db(db).collection('account');
  const users = connection.db(db).collection('user');

  await accounts.deleteMany({});
  await users.deleteMany({});

  await accounts.insertOne(devAccount1);
  await users.insertOne(devUser1);

  await accounts.insertOne(devAccount2);
  await users.insertOne(devUser2);
  
  connection.close();
})()
  .then(() => console.info('done')).catch(error => console.error(error));
