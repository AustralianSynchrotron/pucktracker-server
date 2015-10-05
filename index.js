import startServer from './src/server'
import config from './config'

const env = process.env.NODE_ENV || 'development'

startServer(config[env])
