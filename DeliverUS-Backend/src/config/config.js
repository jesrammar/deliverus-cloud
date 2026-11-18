import dotenv from 'dotenv'
import { readFileSync } from 'node:fs'
dotenv.config()

const nodeEnvironment = (process.env.NODE_ENV || 'development').trim()

const configEnvironments = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    appPort: process.env.APP_PORT,
    dialect: 'mariadb',
    dialectOptions: {
      ssl: {
        ca: readFileSync(new URL('../../certs/rds-ca.pem', import.meta.url), 'utf8'),
        rejectUnauthorized: true
      }
    },
    logging: false
  },
  test: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mariadb',
    logging: false
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: 'mariadb',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
}

const getEnvironmentConfig = function () {
  return configEnvironments[nodeEnvironment]
}

export default getEnvironmentConfig
