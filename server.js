require('dotenv').config();
const express = require('express');
const cors = require('cors');
const spotifyRoutes = require('./routes/spotifyRoutes');

const app = express();
const PORT = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

app.use('/', spotifyRoutes);

// Se quiser testar no navegador com uma resposta simples
app.get('/', (req, res) => {
  res.send('MixFix API está rodando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});