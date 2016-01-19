export default {
  testing: {
    port: 8092,
    db: 'mongodb://localhost/pucktracker_testing',
  },
  development: {
    port: 8090,
    db: 'mongodb://localhost/pucktracker_dev',
  },
  production: {
    port: 8091,
    db: 'mongodb://localhost/pucktracker',
  },
}
