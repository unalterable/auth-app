require('../babel');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { expect } = require('chai');
const { db, server } = require('./helpers');

const consoleError = console.error;

const account = { username: 'testUser', password: 'testPassword', emailAddress: 'test@user.com' };
const roles = ['a role', 'another role'];

describe('Authenticate Account: POST /api/authenticate', async () => {
  let accountCollection;
  let userCollection;

  before(async () => {
    accountCollection = await db.collectionTools({ db: 'auth-app', collection: 'account' });
    userCollection = await db.collectionTools({ db: 'auth-app', collection: 'user' });
    await accountCollection.removeAll();
    await userCollection.removeAll();
    await server.start();

    const { status } = await axios.put(`${server.getDomain()}/api/account`, account, { validateStatus: false });
    await userCollection.updateOne({ name: account.username }, { roles });
    expect(status).to.equal(201);
  });

  after(async () => {
    await server.stop();
  });

  afterEach(() => { console.error = consoleError; });

  it('fails with an incorrect username', async () => {
    console.error = () => {};

    const loginDetails = { username: 'nonExistantUser', password: 'testPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');
  });

  it('fails with an incorrect password', async () => {
    console.error = () => {};

    const loginDetails = { username: 'testUser', password: 'badPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');
  });

  it('reponds with 200, and responds with a JWT full of claims, and the same JWT in set-cookie header', async () => {
    const loginDetails = { username: 'testUser', password: 'testPassword' };

    const { data, headers, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(200);
    expect(data).to.be.a('string');
    expect(jwt.verify(data, 'AN INSECURE SECRET')).to.be.an('object').that.deep.includes({
      account: { name: account.username },
      user: { name: account.username, emailAddress: account.emailAddress, roles },
    });
    expect(headers['set-cookie'][0]).to.include(data);
  });
});
