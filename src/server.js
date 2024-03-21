const express = require("express");
const cors = require("cors");
const routes = require("./routers");
require("dotenv").config();

const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require("./swagger.json");

const jwt = require("jsonwebtoken");

require("./database");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(3333, (err) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: "Erro no servidor" });
  }
});
