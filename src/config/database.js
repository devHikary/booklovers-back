require("dotenv-safe").config();

module.exports = {
  dialect: process.env.DIALECT,
  host: process.env.HOST,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${process.env.ENDPOINT_ID}`,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
};