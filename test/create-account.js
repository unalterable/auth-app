require('../babel');
const axios = require('axios');
const moment = require('moment');
const { expect } = require('chai');
const { db, server } = require('./helpers');

const consoleError = console.error;

const getLastMinRange = () => [moment().subtract(1, 'minute').toDate(), moment().toDate()];

describe('Create Account: PUT /api/account', async () => {
  let accountCollection;
  let userCollection;
  let auditCollection;

  before(async () => {
    accountCollection = await db.collectionTools({ db: 'auth-app', collection: 'account' });
    userCollection = await db.collectionTools({ db: 'auth-app', collection: 'user' });
    auditCollection = await db.collectionTools({ db: 'auth-app', collection: 'audit' });
    await accountCollection.removeAll();
    await userCollection.removeAll();
    await server.start();
  });

  beforeEach(async () => {
    await auditCollection.removeAll();
  });

  after(async () => {
    await server.stop();
  });

  afterEach(() => { console.error = consoleError; });

  it('fails without an account name', async () => {
    console.error = () => {};

    const reqBody = {};
    const { data, status } = await axios.put(`${server.getDomain()}/api/account`, reqBody, { validateStatus: false });

    expect(status).to.equal(400);
    expect(data).to.be.a('string').that.equals('Validation error: "username" is required');

    expect(await accountCollection.getAll()).to.have.length(0);
    expect(await userCollection.getAll()).to.have.length(0);

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'ACCOUNT_CREATION_FAILURE',
      details: { error: 'Validation error: "username" is required' },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });

  it('fails without a password', async () => {
    console.error = () => {};

    const reqBody = { username: 'testUser' };
    const { data, status } = await axios.put(`${server.getDomain()}/api/account`, reqBody, { validateStatus: false });

    expect(status).to.equal(400);
    expect(data).to.be.a('string').that.equals('Validation error: "password" is required');

    expect(await accountCollection.getAll()).to.have.length(0);
    expect(await userCollection.getAll()).to.have.length(0);

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'ACCOUNT_CREATION_FAILURE',
      details: { error: 'Validation error: "password" is required' },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });

  it('fails without an email address', async () => {
    console.error = () => {};

    const reqBody = { username: 'testUser', password: 'testPassword' };
    const { data, status } = await axios.put(`${server.getDomain()}/api/account`, reqBody, { validateStatus: false });

    expect(status).to.equal(400);
    expect(data).to.be.a('string').that.equals('Validation error: "emailAddress" is required');

    expect(await accountCollection.getAll()).to.have.length(0);
    expect(await userCollection.getAll()).to.have.length(0);

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'ACCOUNT_CREATION_FAILURE',
      details: { error: 'Validation error: "emailAddress" is required' },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });

  it('reponds with 200, and creates an account and user entry', async () => {
    const reqBody = { username: 'testUser', password: 'testPassword', emailAddress: 'test@user.com' };
    const { data, status } = await axios.put(`${server.getDomain()}/api/account`, reqBody, { validateStatus: false });

    expect(status).to.equal(201);
    expect(data).to.be.a('string').that.equals('');

    expect(await accountCollection.getAll()).to.have.length(1);
    expect(await userCollection.getAll()).to.have.length(1);

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({type: 'ACCOUNT_CREATION'});
    expect(audits[0].details).to.have.keys(['newUser', 'newAccount']);
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());

  });
});
