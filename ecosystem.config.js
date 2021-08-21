module.exports = {
  apps: [{
    name: 'mongo-api',
    script: './server.js',
    // watch: ['index.js', 'server.js', 'db.js'],
    // watch_delay: 1,
    instances: 1,
    // watch: 'true',
    error_file: './logs/child-err.log',
    // max_memory_restart : "256MB",
    out_file: './logs/child-out.log',
  }],
};
