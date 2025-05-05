let currentPage = 0;
let movies = [];
let filteredMovies = [];
let baseURL = '';
let username = '';
let password = '';

function saveCredentials(ip, user, pass) {
  const credentials = { ip, user, pass, timestamp: Date.now() };
  localStorage.setItem('xtream_credentials', JSON.stringify(credentials));
}

function loadSavedCredentials() {
  const saved = localStorage.getItem('xtream_credentials');
  if (!saved) return;

  const { ip, user, pass, timestamp } = JSON.parse(saved);
  const age = Date.now() - timestamp;

  if (age < 10 * 60 * 1000) {
    document.getElementById('ip').value = ip;
    document.getElementById('user').value = user;
    document.getElementById('pass').value = pass;
  }
}

window.onload = loadSavedCredentials;

async function loadMovies() {
  const ip = document.getElementById('ip').value.trim();
  username = document.getElementById('user').value.trim();
  password = document.getElementById('pass').value.trim();

  if (!ip || !username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  saveCredentials(ip, username, password);

  baseURL = ip.startsWith('http://') || ip.startsWith('https://') ? ip : `https://${ip}`;
  const movieResUrl = `${baseURL}/player_api.php?username=${username}&password=${password}&action=get_vod_streams`;

  try {
    const movieRes = await fetch(movieResUrl);
    const movieData = await movieRes.json();

    if (!Array.isArray(movieData)) {
      alert("No se encontraron películas o no se pudo conectar.");
      return;
    }

    movies = movieData;
    filteredMovies = [...movies];
    currentPage = 0;
    renderMovies();
  } catch (err) {
    console.error(err);
    alert("Error de conexión o respuesta inválida del servidor.");
  }
}

function renderMovies() {
  const container = document.getElementById('movieContainer');
  container.innerHTML = '';
  const start = currentPage * 40;
  const pageMovies = filteredMovies.slice(start, start + 40);

  pageMovies.forEach(movie => {
    const div = document.createElement('div');
    div.className = 'movie-card';
    div.innerHTML = `
      <img src="${movie.stream_icon || 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
      <div>${movie.name}</div>
    `;
    div.onclick = () => openModal(movie);
    container.appendChild(div);
  });
}

function nextPage() {
  if ((currentPage + 1) * 40 < filteredMovies.length) {
    currentPage++;
    renderMovies();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderMovies();
  }
}

function openModal(movie) {
  const streamUrl = `${baseURL}/movie/${username}/${password}/${movie.stream_id}`;
  const ext = movie.container_extension || 'mp4';
  const fullUrl = `${streamUrl}.${ext}`;

  document.getElementById('movieTitle').textContent = movie.name;
  const playerDiv = document.getElementById('player');
  playerDiv.innerHTML = '';

  if (ext === 'mp4') {
    jwplayer("player").setup({
      file: fullUrl,
      width: "100%",
      aspectratio: "16:9",
      autostart: true
    });
  } else {
    const videoElement = document.createElement('video');
    videoElement.src = fullUrl;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.style.width = "100%";
    playerDiv.appendChild(videoElement);
  }

  document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() {
  jwplayer("player").remove();
  document.getElementById('player').innerHTML = '';
  document.getElementById('modalBg').style.display = 'none';
  document.getElementById('movieTitle').textContent = '';
}

function filterMovies() {
  const query = document.getElementById('search').value.toLowerCase();
  filteredMovies = movies.filter(movie => movie.name.toLowerCase().includes(query));
  currentPage = 0;
  renderMovies();
}
