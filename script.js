window.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginSpotifyBtn');
  
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = 'http://mixfix.onrender.com/login';
      });
    }

  // Pega o token da URL e salva no localStorage
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  const userId = params.get('userId');
  
  if (token) {
    localStorage.setItem('spotify_token', token);
    console.log('Token salvo com sucesso!');
    localStorage.setItem('spotify_userId', userId);
    console.log('User_ID salvo com sucesso!');
    window.history.replaceState({}, document.title, '/home.html');
  } else {
    console.warn('Token não encontrado na URL.');
  }
  
  // Verifica e usa o token
  const accessToken = localStorage.getItem('spotify_token');
  
  if (accessToken) {
    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(res => res.json())
      .then(user => {
        console.log('Usuário logado:', user.display_name);
      })
      .catch(err => {
        console.error('Erro ao buscar dados do usuário:', err);
      });
  }


  const emojiBoxes = document.querySelectorAll('.emoji-box');
      const emojiInput = document.querySelector('input[type="text"]');
      const generatePlaylistBtn = document.getElementById('generatePlaylistBtn');

      let selectedEmoji = null;

      emojiBoxes.forEach(box => {
        box.addEventListener('click', () => {
          selectedEmoji = box.textContent;
          console.log('Emoji selecionado:', selectedEmoji);
        });
      });

      generatePlaylistBtn.addEventListener('click', () => {
        if (!selectedEmoji && !emojiInput.value) {
          alert('Selecione um emoji ou insira uma palavra.');
          return;
        }

        const emoji = selectedEmoji || emojiInput.value;
        const token = localStorage.getItem('spotify_token');

        fetch(`https://mixfix.onrender.com/generate-playlist?emoji=${encodeURIComponent(emoji)}&token=${token}`)
          .then(response => response.json())
          .then(data => {
            if (data.playlistUrl) {
              // Redirecionar para a playlist criada
              window.location.href = data.playlistUrl;
            } else {
              alert('Erro ao criar a playlist.');
            }
          })
          .catch(err => {
            console.error('Erro ao gerar playlist:', err);
            alert('Houve um erro ao criar a playlist.');
          });
      });
      
      document.getElementById('generatePlaylistBtn').addEventListener('click', () => {
        const mood = document.querySelector('.selected-emoji').innerText; // Pegue o emoji ou o "mood" selecionado
        const token = localStorage.getItem('spotify_token');
        const userId = localStorage.getItem('spotify_userId');
      
        if (token && userId && mood) {
          fetch('http://localhost:3000/create-playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, userId, mood }),
          })
            .then(res => res.json())
            .then(data => {
              console.log('Playlist criada:', data);
              // Redirecionar para a page2.html com a playlist criada
              window.location.href = `Page2.html?playlistId=${data.playlistId}`;
            })
            .catch(err => console.error('Erro ao criar a playlist:', err));
        }
      });

      params = new URLSearchParams(window.location.search);
      const playlistId = params.get('playlistId');

      if (playlistId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/playlist/${playlistId}`;
        iframe.width = '300';
        iframe.height = '380';
        iframe.frameBorder = '0';
        iframe.allow = 'encrypted-media';
        
        document.getElementById('playlist-container').appendChild(iframe);
      }
}); 