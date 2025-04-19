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
  const { emoji, token } = req.query;

  // Mapear emojis para moods
  const moodMap = {
    "😀": "happy",
    "😭": "sad",
    "😎": "chill",
    "🤘": "rock",
    "😱": "intense",
    "😍": "romantic",
    "😴": "sleep",
    // adicione mais...
  };

  const mood = moodMap[emoji] || "mood";

  try {
    // Criação da playlist no Spotify
    const response = await axios.post(
      'https://api.spotify.com/v1/users/YOUR_USER_ID/playlists',
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

    const playlistUrl = response.data.external_urls.spotify;

    res.json({ message: 'Playlist criada', playlistUrl });
  } catch (error) {
    console.error(error.response?.data || error);
    res.status(500).send('Erro ao criar playlist');
  }
});

router.post('/create-playlist', async (req, res) => {
  const { token, userId, mood } = req.body;

  try {
    // Fazendo uma requisição para criar a playlist
    const response = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: `Playlist para o humor: ${mood}`,
        description: `Uma playlist para o humor ${mood}`,
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Responde com sucesso e o ID da playlist criada
    res.json({
      message: 'Playlist criada com sucesso!',
      playlistId: response.data.id,
    });
  } catch (err) {
    console.error('Erro ao criar playlist:', err);
    res.status(500).send('Erro ao criar playlist');
  }
});


module.exports = router;