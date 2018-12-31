require('../babel');
const axios = require('axios');
const { expect } = require('chai');
const { db, server } = require('./helpers');

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

  it('fails with an incorrect username', async () => {
    const loginDetails = { username: 'nonExistantUser', password: 'testPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');
  });

  it('fails with an incorrect password', async () => {
    const loginDetails = { username: 'testUser', password: 'badPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(401);
    expect(data).to.be.a('string').that.equals('Authentication failed');
  });

  it('reponds with 200, and responds with all the claims needed for a JWT', async () => {
    const loginDetails = { username: 'testUser', password: 'testPassword' };

    const { data, status } = await axios.post(`${server.getDomain()}/api/authenticate`, loginDetails, { validateStatus: false });

    expect(status).to.equal(200);
    expect(data).to.be.an('object').that.deep.equals({
      account: { name: account.username },
      user: { name: account.username, emailAddress: account.emailAddress, roles },
    });
  });
});
