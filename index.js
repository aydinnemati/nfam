const fastify = require('fastify')({
  logger: true,
});

// ####################### //
//      user userModel     //
// ####################### //

const userModel = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string' },
    email: { type: 'string' },
  },
};

const schema = {
  body: userModel,
};
// ####################### //
//     db connection       //
// ####################### //

// ########################################################################### COMMENTED FOR TESTING

// Connection URL

fastify.register(require('fastify-mongodb'), {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: 'mongodb://127.0.0.1:27017/colt01',
});

// #################################################################################################

// ####################### //
//         swagger         //
// ####################### //

fastify.register(require('fastify-swagger'), {
  routePrefix: '/ss',
  swagger: {
    info: {
      title: 'my first node.js api',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
    host: 'localhost:4000',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    definitions: {
      userCreate: {
        type: 'string',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },

  uiConfig: {
    docExpansion: 'full',
    deepLinking: false,
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
});

fastify.ready((err) => {
  if (err) throw err;
  fastify.swagger();
});

// ####################### //
//        routes           //
// ####################### //

// create user
fastify.post('/api/create-developer', { schema }, (request, reply) => {
  const { name } = request.body;

  const eemail = request.body.email;
  fastify.mongo.db.collection('developers').insertOne({ name, email: eemail }, (error) => {
    if (error) {
      return error;
    }
    return reply.send(`user ${name} added`);
  });
});

// get users list
fastify.get('/api/', (request, reply) => {
  const listUsers = [];
  fastify.mongo.db.collection('developers').find({}).toArray((err, result) => {
    if (err) throw err;
    result.forEach((u) => {
      const user = {
        // eslint-disable-next-line no-underscore-dangle
        _id: u._id.toString(),
        name: u.name,
        email: u.email,
      };
      listUsers.push(user);
    });
    // console.log(listUsers)
    reply.send(listUsers);
  });
});

// edit user
fastify.put('/api/:username', (request, reply) => {
  fastify.mongo.db.collection('developers').findOneAndUpdate({ name: request.params.username }, { $set: request.body.fieldToUpdate }, { returnOriginal: false }, (err, doc) => {
    if (err) throw err;
    reply.send(doc);
  });
});

// delete user
fastify.delete('/api/delete-developer/:username', (request, reply) => {
  fastify.mongo.db.collection('developers').findOneAndDelete({ name: request.params.username }, (err, doc) => {
    if (err) throw err;
    reply.send(doc);
    // return doc;
  });
});

// // Run the server!
// fastify.listen(4000, (err, address) => {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
//   fastify.log.info(`server listening on ${address}`);
// });

module.exports = fastify;
