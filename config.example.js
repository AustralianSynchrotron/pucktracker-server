export default {
  testing: {
    httpPort: 8002,
    wsPort: 8102,
    db: 'mongodb://localhost/pucktracker_testing',
  },
  development: {
    httpPort: 8000,
    wsPort: 8100,
    db: 'mongodb://db/pucktracker_dev',
  },
  production: {
    httpPort: 8001,
    wsPort: 8101,
    db: 'mongodb://db/pucktracker',
  },
}
