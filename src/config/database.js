require('dotenv').config();
const pg = require('pg')

let { DIALECT, HOST, DATABASE, USERNAME, PASSWORD, ENDPOINT_ID } = process.env;

module.exports = {
  dialect: DIALECT,
  dialectModule: pg, 
  host: HOST,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  port: 5432,
  dialectOptions: {
    project: ENDPOINT_ID,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    timestamps: true,
    underscored: true,
  },
};