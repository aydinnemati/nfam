const fastifyi = require('./index');
const vars = require('./env');

fastifyi.listen(4000, vars.SEVER_ADR, (err) => {
  if (err) {
    fastifyi.log.error(err);
    process.exit(1);
  }
  // fastify.log.info(`server listening on ${address}`);
});
