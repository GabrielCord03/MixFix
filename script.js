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
  
  if (token) {
    localStorage.setItem('spotify_token', token);
    console.log('Token salvo com sucesso!');
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
}); 