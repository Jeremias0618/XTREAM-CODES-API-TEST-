let currentPage = 0;
let channels = [];
let filteredChannels = [];
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

async function loadChannels() {
  const ip = document.getElementById('ip').value.trim();
  username = document.getElementById('user').value.trim();
  password = document.getElementById('pass').value.trim();

  if (!ip || !username || !password) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  saveCredentials(ip, username, password);

  baseURL = ip.startsWith('http://') || ip.startsWith('https://') ? ip : `https://${ip}`;
  const url = `${baseURL}/player_api.php?username=${username}&password=${password}&action=get_live_streams`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!Array.isArray(data)) {
      alert("No se encontraron canales o error en la conexión.");
      return;
    }

    channels = data;
    filteredChannels = [...channels];
    currentPage = 0;
    renderChannels();
  } catch (err) {
    console.error(err);
    alert("Error al conectar o respuesta inválida.");
  }
}

function renderChannels() {
  const container = document.getElementById('channelContainer');
  container.innerHTML = '';
  const start = currentPage * 40;
  const pageChannels = filteredChannels.slice(start, start + 40);

  pageChannels.forEach(channel => {
    const div = document.createElement('div');
    div.className = 'channel-card';
    div.innerHTML = `
      <img src="${channel.stream_icon || 'https://via.placeholder.com/150'}" onerror="this.src='https://via.placeholder.com/150'">
      <div>${channel.name}</div>
    `;
    div.onclick = () => openModal(channel);
    container.appendChild(div);
  });
}

function nextPage() {
  if ((currentPage + 1) * 40 < filteredChannels.length) {
    currentPage++;
    renderChannels();
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    renderChannels();
  }
}

function openModal(channel) {
  const streamUrl = `${baseURL}/live/${username}/${password}/${channel.stream_id}.m3u8`;
  document.getElementById('channelTitle').textContent = channel.name;
  const playerDiv = document.getElementById('player');
  playerDiv.innerHTML = '';

  jwplayer("player").setup({
    file: streamUrl,
    width: "100%",
    aspectratio: "16:9",
    autostart: true
  });

  document.getElementById('modalBg').style.display = 'flex';
}

function closeModal() {
  jwplayer("player").remove();
  document.getElementById('player').innerHTML = '';
  document.getElementById('modalBg').style.display = 'none';
  document.getElementById('channelTitle').textContent = '';
}

function filterChannels() {
  const query = document.getElementById('search').value.toLowerCase();
  filteredChannels = channels.filter(channel => channel.name.toLowerCase().includes(query));
  currentPage = 0;
  renderChannels();
}
