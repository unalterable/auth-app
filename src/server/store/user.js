const uuidv4 = require('uuid/v4');
const _  = require('lodash');

const sanitiseItem = item => _.omit(item, '_id');
const projection = { _id: 0 };

module.exports = ({ getCollection }) => {
  const getUsers = () => getCollection('user');

  getUsers().then(accounts => {
    accounts.createIndex({ id: 1 }, { unique: true });
    accounts.createIndex({ name: 1 }, { unique: true });
  });

  return {
    insert: item => getUsers()
      .then(collection => collection
        .insertOne({ ...item, id: uuidv4() }))
      .then(result => sanitiseItem(result.ops[0])),
    getById: id => getUsers()
      .then(collection => collection
        .findOne({ id }, { projection })),
  };
};
