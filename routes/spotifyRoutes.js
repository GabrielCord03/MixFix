const express = require('express');
const router = express.Router();
const { getAuthUrl, getTokens } = require('../auth/spotifyAuth');
const { createPlaylist } = require('../api/spotifyApi');

router.get('/login', (req, res) => {
  res.redirect(getAuthUrl());
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const { access_token } = await getTokens(code);

    // Apenas login por enquanto
    res.redirect(`http://localhost:5500/home.html?token=${access_token}`);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Erro ao autenticar');
  }
});

module.exports = router;