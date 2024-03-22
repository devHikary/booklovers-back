const express = require("express");
const cors = require("cors");
const routes = require("./routers");
require("dotenv").config();

const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require("./swagger.json");

const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000; 

require("./database");

const app = (module.exports = express());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: "Erro no servidor" });
  }
});
