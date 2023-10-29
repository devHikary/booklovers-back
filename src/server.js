const express = require('express');
const cors = require('cors');
const routes = require('./routers');
require("dotenv-safe").config();

const jwt = require('jsonwebtoken');

require('./database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(3333);