const express = require("express");
const cors = require("cors");
const routes = require("../src/routers");
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.12.0/swagger-ui.min.css";
require("dotenv").config();

const swaggerUi = require('swagger-ui-express')
const swaggerDocs = require("../src/swagger.json");

const jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 5000; 

require("../src/database");

const app = express();

app.use(express.static(pathToSwaggerUi))
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { customCssUrl: CSS_URL }));

app.use(cors());
app.use(express.json());
app.use(routes);

app.get("/", (req, res) => res.send("Express on Vercel"));

app.listen(PORT, () => console.log("Server ready on port ",PORT));

module.exports = app;