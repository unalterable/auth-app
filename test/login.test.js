require('../babel');
const axios = require('axios');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const setCookieParser = require('set-cookie-parser');
const { expect } = require('chai');
const { db, server } = require('./helpers');

const getLastMinRange = () => [moment().subtract(1, 'minute').toDate(), moment().toDate()];

const consoleError = console.error;

const account = { username: 'testUser', password: 'testPassword', emailAddress: 'test@user.com' };
const roles = ['a role', 'another role'];

describe('Authenticate Account: POST /auth/api/authenticate', async () => {
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

    const { status } = await axios.put(`${server.getDomain()}/auth/api/account`, account, { validateStatus: false });
    await userCollection.updateOne({ name: account.username }, { roles });
    expect(status).to.equal(201);
  });

  beforeEach(async () => {
    await auditCollection.removeAll();
  });

  after(async () => {
    await server.stop();
  });

  afterEach(() => { console.error = consoleError; });

  it('fails with an incorrect username', async () => {
    console.error = () => {};

    const loginDetails = { username: 'nonExistantUser', password: 'testPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/auth/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'AUTHENTICATION_FAILURE',
      details: { error: `No account found for account "${loginDetails.username}"` },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });

  it('fails with an incorrect password', async () => {
    console.error = () => {};

    const loginDetails = { username: 'testUser', password: 'badPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/auth/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'AUTHENTICATION_FAILURE',
      details: { error: `Incorrect password for account "${loginDetails.username}"` },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });

  it('reponds with 200, and responds with a JWT full of claims in set-cookie header', async () => {
    const loginDetails = { username: 'testUser', password: 'testPassword' };

    const response = await axios.post(`${server.getDomain()}/auth/api/authenticate`, loginDetails, { validateStatus: false });

    expect(response.status).to.equal(200);

    const setCookie = setCookieParser(response);

    expect(setCookie[0].name).to.equal('jwt');

    const token = jwt.verify(setCookie[0].value, 'AN INSECURE SECRET');
    expect(token).to.be.an('object').that.includes.keys(['account', 'user']);
    expect(token.account).to.deep.equal({ name: account.username });
    expect(token.user).to.deep.include({ name: account.username, emailAddress: account.emailAddress, roles });
    expect(token.user).to.include.key('id');
    const users = await userCollection.getAll(); 
    expect(users.find(u => u.name === token.user.name)).to.include({ id: token.user.id });

    const audits = await auditCollection.getAll();
    expect(audits).to.have.length(1);
    expect(audits[0]).to.deep.include({
      type: 'AUTHENTICATION_SUCCESS',
      details: { userId: token.user.id },
    });
    expect(new Date(audits[0].timestamp)).to.be.within(...getLastMinRange());
  });
});
