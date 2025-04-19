const express = require('express');
const router = express.Router();
const { getAuthUrl, getTokens } = require('../auth/spotifyAuth');
const axios = require('axios');

router.get('/login', (req, res) => {
  res.redirect(getAuthUrl());
});

router.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    // Obtendo o token de acesso
    const { access_token } = await getTokens(code);

    // Captura o User ID
    const userResponse = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const userId = userResponse.data.id;

    // Agora você pode usar esse userId para criar playlists ou qualquer outra coisa
    console.log('User ID:', userId);

    // Redireciona para a página com o token e o User ID (no frontend)
    res.redirect(`http://localhost:5500/index.html?token=${access_token}&userId=${userId}`);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Erro ao autenticar');
  }
});

router.get('/generate-playlist', async (req, res) => {
  const { emoji, token, userId } = req.query;

  const moodMap = {
    "😀": "happy",
    "😭": "sad",
    "😎": "chill",
    "🤘": "rock",
    "😱": "intense",
    "😍": "romantic",
    "😴": "sleep"
  };

  const mood = moodMap[emoji] || "mood";

  try {
    // 1. Criar a playlist
    const createRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `Mix&Fix - ${mood}`,
        description: `Playlist para o mood: ${emoji}`,
        public: false
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const playlistId = createRes.data.id;

    // 2. Buscar músicas relacionadas ao mood
    const searchRes = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        q: mood,
        type: 'track',
        limit: 10
      }
    });

    const trackUris = searchRes.data.tracks.items.map(track => track.uri);

    // 3. Adicionar as faixas à playlist
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: trackUris
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const playlistUrl = createRes.data.external_urls.spotify;

    res.json({ message: 'Playlist criada com faixas!', playlistUrl });

  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).json({ error: 'Erro ao criar playlist' });
  }
});


module.exports = router;