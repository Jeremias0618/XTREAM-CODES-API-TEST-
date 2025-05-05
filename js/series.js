let series = [];
let filteredSeries = [];
let currentPage = 1;
const itemsPerPage = 40;
let baseURL = '', username = '', password = '';

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

window.loadSeries = async function () {
  baseURL = document.getElementById('ip').value.trim();
  username = document.getElementById('user').value.trim();
  password = document.getElementById('pass').value.trim();

  if (!baseURL.startsWith('http')) baseURL = 'http://' + baseURL;
  const url = `${baseURL}/player_api.php?username=${username}&password=${password}&action=get_series`;

  try {
    const res = await fetch(url);
    series = await res.json();
    filteredSeries = [...series];
    currentPage = 1;
    renderSeries();
    saveCredentials(baseURL, username, password);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  } catch (err) {
    alert("Error cargando series");
    console.error(err);
  }
};

window.renderSeries = async function () {
  const container = document.getElementById('seriesContainer');
  container.innerHTML = '';

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageSeries = filteredSeries.slice(start, end);

  for (const s of pageSeries) {
    let poster = s.cover || '';
    if (!poster || poster === '') {
      try {
        const imdb = await fetch(`https://imdb-api.com/es/API/SearchSeries/eae5dbe11c2b8d96808af6b5e0fec463/${encodeURIComponent(s.name)}`);
        const data = await imdb.json();
        poster = data.results && data.results[0] ? data.results[0].image : 'https://via.placeholder.com/150';
      } catch {
        poster = 'https://via.placeholder.com/150';
      }
    }

    const div = document.createElement('div');
    div.className = 'series-card';
    div.innerHTML = `<img src="${poster}" alt="${s.name}"><div>${s.name}</div>`;
    div.onclick = () => loadEpisodes(s.series_id);
    container.appendChild(div);
  }
};

window.prevPage = function () {
  if (currentPage > 1) {
    currentPage--;
    renderSeries();
  }
};

window.nextPage = function () {
  const maxPage = Math.ceil(filteredSeries.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderSeries();
  }
};

window.filterSeries = function () {
  const query = document.getElementById('search').value.toLowerCase();
  filteredSeries = series.filter(s => s.name.toLowerCase().includes(query));
  currentPage = 1;
  renderSeries();
};

async function loadEpisodes(series_id) {
  const url = `${baseURL}/player_api.php?username=${username}&password=${password}&action=get_series_info&series_id=${series_id}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.episodes || Object.keys(data.episodes).length === 0) {
      alert("No hay episodios disponibles para esta serie.");
      return;
    }

    const overlay = document.getElementById('overlay');
    const episodeList = document.getElementById('episodeList');
    episodeList.innerHTML = '';

    let sortedEpisodes = [];
    for (const seasonKey in data.episodes) {
      const season = data.episodes[seasonKey];
      season.forEach(ep => {
        sortedEpisodes.push({ season: seasonKey, episode: ep });
      });
    }

    sortedEpisodes.sort((a, b) => {
      return a.season - b.season || a.episode.episode_number - b.episode.episode_number;
    });

    sortedEpisodes.forEach(ep => {
      const streamId = ep.episode.stream_id || ep.episode.id || ep.episode.episode_id;
      const ext = ep.episode.container_extension || 'mp4';
      const btn = document.createElement('button');
      btn.className = 'episode-btn';
      btn.textContent = `${ep.episode.title}`;

      if (streamId) {
        btn.onclick = () => playEpisode(streamId, ext, ep.episode.title);
      } else {
        btn.disabled = true;
        btn.title = "Episodio no disponible";
      }

      episodeList.appendChild(btn);
    });

    overlay.classList.add('visible');

  } catch (err) {
    alert("No se pudieron cargar los episodios");
    console.error(err);
  }
}

function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('visible');
}

function playEpisode(stream_id, ext = 'mp4', title = '') {
  ext = ext || 'mp4';
  const url = `${baseURL}/series/${username}/${password}/${stream_id}.${ext}`;

  document.querySelector('.episode-btn-container').classList.add('hidden');
  document.body.style.backgroundColor = "#000";

  const playerDiv = document.getElementById('player');
  const nativePlayer = document.getElementById('nativePlayer');

  try { jwplayer("player").remove(); } catch (e) {}

  nativePlayer.pause();
  nativePlayer.removeAttribute('src');
  nativePlayer.load();

  playerDiv.innerHTML = `<div class="episode-title">${title}</div>`;

  if (ext === 'mp4') {
    nativePlayer.style.display = 'none';
    playerDiv.style.display = 'block';

    jwplayer("player").setup({
      file: url,
      width: "100%",
      height: "480",
      image: 'images/default-thumbnail.jpg',
    });
  } else {
    nativePlayer.style.display = 'block';
    playerDiv.style.display = 'none';

    nativePlayer.src = url;
    nativePlayer.play();
  }

  closeOverlay();
}

document.getElementById('overlay').addEventListener('click', function(event) {
  if (event.target === this) {
    closeOverlay();
  }
});
