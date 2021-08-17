const fastifyi = require('./index');

fastifyi.listen(4000, (err) => {
  if (err) {
    fastifyi.log.error(err);
    process.exit(1);
  }
  // fastify.log.info(`server listening on ${address}`);
});
