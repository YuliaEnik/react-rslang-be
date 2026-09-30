const mongoose = require('mongoose');
const app = require('../src/app');
const { MONGO_CONNECTION_STRING } = require('../src/common/config');

// Reuse the connection between invocations of a warm serverless function
let connection = null;

const connect = () => {
  if (!connection) {
    connection = mongoose
      .connect(MONGO_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      })
      .catch(err => {
        connection = null;
        throw err;
      });
  }
  return connection;
};

module.exports = async (req, res) => {
  await connect();
  return app(req, res);
};
