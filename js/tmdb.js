const apiKeyKey = 'tmdb_api_key';
const keyExpirationKey = 'tmdb_api_expire';

const savedKey = localStorage.getItem(apiKeyKey);
const expiresAt = localStorage.getItem(keyExpirationKey);

if (savedKey && Date.now() < parseInt(expiresAt)) {
  document.getElementById('apiKeyInput').value = savedKey;
}

function saveApiKey() {
  const key = document.getElementById('apiKeyInput').value.trim();
  if (!key) return alert("You must enter an API KEY");
  localStorage.setItem(apiKeyKey, key);
  localStorage.setItem(keyExpirationKey, Date.now() + 3 * 60 * 60 * 1000);
  alert("API KEY saved for 3 hours");
}

async function searchTMDB() {
  const query = document.getElementById('searchInput').value.trim();
  const apiKey = localStorage.getItem(apiKeyKey);
  if (!apiKey || !query) return;

  const res = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';
  data.results.slice(0, 10).forEach(item => {
    const title = item.title || item.name;
    const year = item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'Unknow';
    const btn = document.createElement('button');
    btn.className = 'block w-full text-left p-2 bg-gray-700 hover:bg-gray-600 mb-2 rounded';
    btn.innerText = `${title} (${year})`;
    btn.onclick = () => loadDetails(item.media_type, item.id);
    resultsDiv.appendChild(btn);
  });
}

async function loadDetails(type, id) {
  document.getElementById('results').innerHTML = '';
  const apiKey = localStorage.getItem(apiKeyKey);
  const lang = 'en-US';

  const [details, credits, videos, images] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=${lang}`).then(res => res.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}&language=${lang}`).then(res => res.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=${lang}`).then(res => res.json()),
    fetch(`https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`).then(res => res.json()),
  ]);

  const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');

  const mainPoster = details.poster_path ? `<img src="https://image.tmdb.org/t/p/w500${details.poster_path}" class="rounded shadow w-full md:w-[58rem]">` : '';

  const detailHTML = `
    <div class="flex flex-col md:flex-row gap-6">
      <div>${mainPoster}</div>
      <div>
        <h2 class="text-2xl font-bold mb-2">${details.title || details.name} (${(details.release_date || details.first_air_date || '').split('-')[0]})</h2>
        <p><strong>Géneros:</strong> ${details.genres.map(g => g.name).join(', ')}</p>
        <p><strong>Sinopsis:</strong> ${details.overview || 'No disponible.'}</p>
        <p><strong>Reparto:</strong> ${credits.cast.slice(0, 5).map(a => a.name).join(', ')}</p>
      </div>
    </div>
    ${trailer ? `<iframe class="w-full h-[31rem] mt-4" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>` : ''}
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-2">🖼️ Posters</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        ${images.posters.slice(0, 8).map(img => `<img src="https://image.tmdb.org/t/p/w500${img.file_path}" class="rounded shadow"/>`).join('')}
      </div>
    </div>
    <div class="mt-6">
      <h3 class="text-xl font-semibold mb-2">📸 Other Images</h3>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        ${images.backdrops.slice(0, 64).map(img => `<img src="https://image.tmdb.org/t/p/w500${img.file_path}" class="rounded shadow"/>`).join('')}
      </div>
    </div>
  `;

  document.getElementById('details').innerHTML = detailHTML;
}
