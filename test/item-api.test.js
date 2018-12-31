require('../babel');
const axios = require('axios');
const { expect } = require('chai');
const _ = require('lodash');
const { db, server } = require('./helpers');

describe('api', () => {
  let collection;

  before(async () => {
    collection = await db.collectionTools({ db: 'base-app', collection: 'items' });
    await server.start();
  });

  after(async () => {
    await server.stop();
  });

  beforeEach(async () => {
    await collection.removeAll();
  });

  describe('get /api/items', async () => {
    it('reponds with 200 and a list of items in the db (without an _id)', async () => {
      await collection.insertMany([{ key1: 'val1' }]);

      const { data, status } = await axios.get(`${server.getDomain()}/api/items`);

      expect(status).to.equal(200);
      expect(data).to.be.an('array').with.length(1);
      expect(data[0]).to.include({ key1: 'val1' });
      expect(data[0]).to.not.include.key('_id');
    });
  });

  describe('get /api/item/:id', async () => {
    it('reponds with 200 and an item that matches the id (without an _id)', async () => {
      await collection.insertMany([{ id: '90', key1: 'val1' }]);

      const { data, status } = await axios.get(`${server.getDomain()}/api/item/90`);

      expect(status).to.equal(200);
      expect(data).to.be.an('object').that.includes({ id: '90', key1: 'val1' });
      expect(data).to.not.include.key('_id');
    });
  });

  describe('put /api/item/:id', async () => {
    it('creates a new item in the DB, responds with 201 and the new item (without an _id)', async () => {
      const { data, status } = await axios.put(`${server.getDomain()}/api/item`, { key2: 'val78' });

      expect(status).to.equal(201);
      expect(data).to.be.an('object').that.includes({ key2: 'val78' });
      expect(data).to.include.key('id');
      expect(data).to.not.include.key('_id');
      expect(data.id).to.be.a('string').with.length(36); // is a uuidv4

      const dbDocs = await collection.getAll();
      expect(dbDocs).to.be.an('array').with.length(1);
      expect(_.omit(dbDocs[0], ['_id'])).to.deep.equal(data);
    });

  });

  describe('post /api/item/:id', async () => {
    it('updates the document with that id in the db and responds with 200 and the updated item (without an _id)', async () => {
      await collection.insertMany([{ id: '90', key1: 'val1', key2: 'val2' }, { id: '91', key2: 'val83' }]);

      const { data, status } = await axios.post(`${server.getDomain()}/api/item/90`, { key2: 'newVal' });

      expect(status).to.equal(200);
      expect(data).to.be.an('object').that.deep.equals({ id: '90', key1: 'val1', key2: 'newVal' });

      const dbDocs = await collection.getAll();
      expect(dbDocs).to.be.an('array').with.length(2);
      expect(_.omit(dbDocs[0], ['_id'])).to.deep.equal(data);
      expect(dbDocs[1]).to.include({ key2: 'val83' });
    });
  });

  describe('delete /api/item/:id', async () => {
    it('deletes the document with that id in the db, responds with 200 and no data', async () => {
      await collection.insertMany([{ id: '90', key2: 'val2' }, { id: '91', key2: 'val83' }]);

      const { data, status } = await axios.delete(`${server.getDomain()}/api/item/90`);

      expect(status).to.equal(200);
      expect(data).to.equal('OK');

      const dbDocs = await collection.getAll();
      expect(dbDocs).to.be.an('array').with.length(1);
      expect(dbDocs[0]).to.include({ key2: 'val83' });
    });
  });

});
