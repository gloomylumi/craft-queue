module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/craftqueue_dev'
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/craftqueue_test'
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }

};
