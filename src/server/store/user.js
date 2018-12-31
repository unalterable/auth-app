const uuidv4 = require('uuid/v4');
const _  = require('lodash');

const sanitiseItem = item => _.omit(item, '_id');
const projection = { _id: 0 };

module.exports = ({ getCollection }) => {
  const getItems = () => getCollection('user');
  return {
    insert: item => getItems()
      .then(collection => collection
        .insertOne({ ...item, id: uuidv4() }))
      .then(result => sanitiseItem(result.ops[0])),
    getById: id => getItems()
      .then(collection => collection
        .findOne({ id }, { projection })),
  };
};
