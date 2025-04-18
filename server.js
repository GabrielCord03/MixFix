const express = require('express');
const cors = require('cors');
require('dotenv').config();

const spotifyRoutes = require('./routes/spotifyRoutes');

const app = express();
app.use(cors()); // permite o frontend acessar

app.use('/', spotifyRoutes);

app.listen(5500, () => {
  console.log('Servidor rodando em http://localhost:5500');
});