const { MongoClient } = require('mongodb');
const config = require('config');
const initAccountCollection = require('./account');
const initUserCollection = require('./user');

const getAuth = () => config.has('db.mongo.user') && config.has('db.mongo.password')
  ? { auth: { user: config.get('db.mongo.user'), password: config.get('db.mongo.password') } }
  : {};

const getConnection = (connectionAttempt => () => {
  if (!connectionAttempt) {
    connectionAttempt = Promise.resolve()
      .then(() => config.get('db.mongo.url'))
      .then(url => MongoClient.connect(url, { ...getAuth(), useNewUrlParser: true, autoReconnect: false }))
      .then(conn => {
        console.info('Mongo connection established');
        conn.on('close', () => {
          console.info('Mongo connection terminated');
          connectionAttempt = null;
        });
        return conn;
      })
      .catch((err) => {
        connectionAttempt = null;
        throw Error(`Mongo connection failed: ${err.message}`);
      });
  }
  return connectionAttempt;
})(null);

const getCollection = (collectionName) => getConnection()
  .then(connection => connection.db(config.get('db.mongo.dbName')).collection(collectionName));

const initStore = () => ({
  getConnection,
  collections: {
    account: initAccountCollection({ getCollection }),
    user: initUserCollection({ getCollection }),
  },
});

module.exports = initStore;
