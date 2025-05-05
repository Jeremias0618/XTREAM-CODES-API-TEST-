# 📺 [XTREAM CODES API TEST](https://jeremias0618.github.io/XTREAM-CODES-API-TEST-)

Web application designed to interact directly with **Xtream Codes / XUI One** servers, allowing the user to view and play **Live TV**, **Series**, **Movies (VOD)** content, and perform multimedia searches through the **TMDB API**.

> This tool is intended as a testing and exploration interface for developers or administrators of Xtream Codes IPTV panels, with a modular, maintainable, and optimized project structure.

---

## 🔧 Main Features

✅ Compatible with the official Xtream Codes API (using `player_api.php`)

✅ Authentication via IP/Domain, Username, and Password

✅ Temporary credential storage (10-minute local cache)

✅ Paginated navigation and dynamic search by name

✅ Custom player:
- 🎦 **JW Player** for `.mp4`
- 🎞️ Native player for `.m3u8`, `.mkv`, `.webm`

✅ Mobile-friendly display

✅ TMDB search engine with rich display: cover art, synopsis, cast, trailer, and more

✅ Professionally organized code in folders: `html/`, `css/`, `js/`, `images/`, `libs/`

---

## 🗂️ Project Structure

```

XTREAM-CODES-API-TEST/
│
├── index.html # Home page (link to other sections)
├── live_tv.html # Live channel player
├── series.html # IPTV series browsing and playback
├── vod.html # On-demand movies
├── tmdb_api.html # Content search via TMDB
│
├── css/ # Styles separated by section
│ ├── live_tv.css
│ ├── series.css
│ ├── vod.css
│ └── tmdb.css
│
├── js/ # Scripts separated by section
│ ├── live_tv.js
│ ├── series.js
│ ├── vod.js
│ └── tmdb.js
│
├── images/ # Graphic resources
│ ├── logo.png
│ └── icon.png
│
└── libs/ # External libraries if you want to include them offline
└── jwplayer.js

```

---

## 🧪 Technical Requirements

- Modern ES6-compatible browser (Chrome, Firefox, Edge)
- Active connection to an Xtream Codes/XUI One server
- Valid [TMDB](https://www.themoviedb.org/) API Key (for `tmdb_api.html`)
- HTTPS connection preferred to avoid issues with mixed content (Optional)

---

## 🚀 How to use?

1. Clone or download the repository.
2. Open any `.html` file directly from your browser.
3. Enter your Xtream Codes credentials:
- IP/Domain
- Username
- Password
4. Click **"Upload"** and browse the content.

> The system remembers your data for 10 minutes using local storage (localStorage).

---

## 📦 Details by section

### 🔴 `live_tv.html`
- Loads all the user's IPTV channels.
- Displays 40 channels per page with thumbnails and names.
- Clicking opens a modal with the live channel.
- Uses JW Player for .m3u8.

### 📚 `series.html`
- Displays a 5x8 grid with series covers.
- Clicking on a series displays the available chapters.
- Selecting a chapter and it plays with the corresponding player.

### 🎥 `vod.html`
- Loads all movies available on the IPTV server.
- Plays with JW Player for .mp4 and native for others.

### 🔍 `tmdb_api.html`
- Allows you to enter a TMDB API key.
- Search for movies, series, or anime by title.
- Displays synopsis, genre, year, cast, background, cover art, and trailer.

---

## 🔐 Security and Privacy

- No data is shared with third parties.
- Credentials are only stored locally in your browser for 10 minutes.
- If you want more security, you can disable temporary storage by modifying the JavaScript code.

---

## ⚙️ Customization

- You can replace `JW Player` with any other player if you have a license.
- You can modify the styles in the `css/` folder or use frameworks like Tailwind, Bootstrap, etc.
- For production purposes, minifying CSS and JS is recommended.

---

## 📄 License

This project is distributed under the MIT License.

You are free to use, modify, and distribute this software under the terms of that license.

---

## 🤝 Credits and Acknowledgments

- [JW Player](https://www.jwplayer.com/)
- [TMDB API](https://developers.themoviedb.org/)
- [Xtream Codes API](https://github.com)
- Free Icons from [Flaticon](https://www.flaticon.com/)

---

## 📬 Contact

Developed by **[Yeremi T](https://github.com/Jeremias0618)**

📧 Do you have questions or suggestions? You can send a direct message.

---

## 📢 Disclaimer

This project has been developed for educational and testing purposes only.

- **Does not promote, endorse, or distribute copyrighted content.**
- **Does not include any illegal content, m3u/m3u8 links, IPTV lists, VODs, or credentials.**
- Use of this system with third-party or unauthorized Xtream Codes servers may infringe
