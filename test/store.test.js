const _  = require('lodash');
const { expect } = require('chai');
const { db } = require('./helpers');

const initStore = require('../src/server/store');

const testDoc = {
  prop1: 'val1',
  prop2: 'val2',
};

describe('store', () => {
  let collectionHelper;
  let getConnection;
  let itemsCollection;

  before(async () => {
    collectionHelper = await db.collectionTools({ db: 'base-app', collection: 'items' });
    ({ getConnection, collections: { items: itemsCollection } } = await initStore());
    getConnection();
  });

  after(() => getConnection().then(conn => conn.close()));

  beforeEach(async () => {
    await collectionHelper.removeAll();
  });

  it('saves a document, adding a uuid', async () => {
    await itemsCollection.insert(testDoc);

    const dbDocs = await collectionHelper.getAll();
    expect(dbDocs).to.have.length(1);

    const dbDoc = dbDocs[0];
    expect(_.omit(dbDoc, ['_id', 'id'])).to.eql(testDoc);
    expect(dbDoc.id).to.be.a('string').with.length(36); // is a uuidv4
  });

  it('retrieves a document', async () => {
    await itemsCollection.insert(testDoc);

    const dbDocs = await itemsCollection.getAll();

    expect(dbDocs).to.have.length(1);
    expect(dbDocs[0]).to.include(testDoc);
  });

  it('updates a document by ID', async () => {
    const entry = await itemsCollection.insert({ prop: 'thing' });

    await itemsCollection.updateById(entry.id, testDoc);

    const dbDocs = await collectionHelper.getAll();
    const updatedItem = dbDocs.find(doc => doc.prop === 'thing');

    expect(updatedItem).to.include({ prop: 'thing' });
    expect(updatedItem).to.include(testDoc);
  });

  it('deletes a document by ID', async () => {
    const entry = await itemsCollection.insert({ prop: 'thing' });

    const dbDocs = await collectionHelper.getAll();
    const dbItem = dbDocs.find(doc => doc.id === entry.id);
    expect(dbItem).to.include({ id: entry.id, prop: 'thing' });

    await itemsCollection.deleteById(entry.id);

    const updatedDbDocs = await collectionHelper.getAll();
    const updatedDbItem = updatedDbDocs.find(doc => doc.id === entry.id);
    expect(updatedDbItem).to.equal(undefined);
  });
});
