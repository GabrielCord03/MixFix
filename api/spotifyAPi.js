const axios = require('axios');

async function createPlaylist(accessToken, name) {
  const me = await axios.get('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const userId = me.data.id;

  const playlist = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    name,
    public: false
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  return playlist.data.id;
}

module.exports = { createPlaylist };
