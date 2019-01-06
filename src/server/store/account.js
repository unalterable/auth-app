const uuidv4 = require('uuid/v4');
const _  = require('lodash');

const sanitiseItem = item => _.omit(item, '_id');
const projection = { _id: 0 };

module.exports = ({ getCollection }) => {
  const getAccounts = () => getCollection('account');

  getAccounts().then(accounts => {
    accounts.createIndex({ id: 1 }, { unique: true });
    accounts.createIndex({ name: 1 }, { unique: true });
  });

  return {
    insert: item => getAccounts()
      .then(accounts => accounts
        .insertOne({ ...item, id: uuidv4() }))
      .then(result => sanitiseItem(result.ops[0])),
    getByName: name => getAccounts()
      .then(accounts => accounts
        .findOne({ name }, { projection })),
  };
};
