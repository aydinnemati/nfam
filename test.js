const { test } = require('tap');
const build = require('./index');

test('testing routes', async (t) => {
  const app = build;
  const user = { name: 'test', email: 'test' };

  // ################# //
  //    create user    //
  // ################# //

  const response = await app.inject({
    method: 'POST',
    url: '/api/create-developer',
    payload: user,
  });
  t.teardown(() => build.close());
  t.equal(response.statusCode, 200, 'returns a user <name> added');
  // delete added user
  build.mongo.db.collection('developers').findOneAndDelete({ name: user.name }, (err) => {
    if (err) throw err;
  });

  // create user without giving user
  const responseNoUser = await app.inject({
    method: 'POST',
    url: '/api/create-developer',
    // payload: { name: 'test', email: 'test' },
  });
  t.teardown(() => build.close());
  t.equal(responseNoUser.statusCode, 400);

  // create user with wrong user model
  const responseWrongUser = await app.inject({
    method: 'POST',
    url: '/api/create-developer',
    payload: { name: 'test' },
  });
  t.teardown(() => build.close());
  t.equal(responseWrongUser.statusCode, 400);

  // ################# //
  //   get users list  //
  // ################# //

  const responseGetUsers = await app.inject({
    method: 'GET',
    url: '/api/',
  });
  t.teardown(() => build.close());
  t.equal(responseGetUsers.statusCode, 200);

  // ################# //
  //    modify user    //
  // ################# //

  // add user test
  build.mongo.db.collection('developers').insertOne(user, (error) => { if (error) throw error; });

  // change user name to changenametest
  const responseUpdateUser = await app.inject({
    method: 'PUT',
    url: `/api/${user.name}`,
    payload: { fieldToUpdate: { name: 'changenametest' } },
  });
  t.teardown(() => build.close());
  t.equal(responseUpdateUser.statusCode, 200, 'returns previous object on db');
  // remove user
  build.mongo.db.collection('developers').findOneAndDelete({ name: 'changenametest' }, (err) => {
    if (err) throw err;
  });

  const responseUpdateWrong = await app.inject({
    method: 'POST',
    url: '/api/asjvdja',
  });
  t.teardown(() => build.close());
  t.equal(responseUpdateWrong.statusCode, 404);

  // ################# //
  //    delete user    //
  // ################# //

  // add user to delete
  build.mongo.db.collection('developers').insertOne(user, (error) => { if (error) throw error; });

  const testDeleteT = await app.inject({
    method: 'DELETE',
    url: `/api/delete-developer/${user.name}`,
  });
  t.teardown(() => build.close());
  t.equal(testDeleteT.statusCode, 200);
});
