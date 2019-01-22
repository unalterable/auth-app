const { MongoClient } = require('mongodb');
const config = require('config');
const initAccountCollection = require('./account');
const initUserCollection = require('./user');
const initAuditCollection = require('./audit');

const mongoOpts = { useNewUrlParser: true, autoReconnect: false };

const getAuth = () => config.has('db.mongo.user') && config.has('db.mongo.password')
  ? { auth: { user: config.get('db.mongo.user'), password: config.get('db.mongo.password') } }
  : {};

const getConnection = (connectionAttempt => () => {
  if (!connectionAttempt) {
    connectionAttempt = (async () => {
      try {
        const url = await config.get('db.mongo.url');
        const connection = await MongoClient.connect(url, { ...mongoOpts, ...getAuth() });
        console.info('Mongo connection established');

        connection.on('close', () => {
          console.info('Mongo connection terminated');
          connectionAttempt = null;
        });

        return connection;
      } catch (err) {
        connectionAttempt = null;
        throw Error(`Mongo connection failed: ${err.message}`);
      }
    })();
  }
  return connectionAttempt;
})(null);

const getCollection = (collectionName) => getConnection()
  .then(connection => connection.db(config.get('db.mongo.dbName')).collection(collectionName));

const initStore = () => ({
  getConnection,
  account: initAccountCollection({ getCollection }),
  user: initUserCollection({ getCollection }),
  audit: initAuditCollection({ getCollection }),
});

module.exports = initStore;
