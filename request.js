const eventId = new URLSearchParams(window.location.search).get('event') || 'live';
const deviceKey = `dj_jdiaz_${eventId}`;

if (localStorage.getItem(deviceKey)) {
  document.body.innerHTML =
    "<h2 style='text-align:center'>✅ Request already submitted</h2>";
}

let selectedTrack = null;

const songInput = document.getElementById('songInput');
const results = document.getElementById('results');
const requestForm = document.getElementById('requestForm');
const guestName = document.getElementById('guestName');
const dedication = document.getElementById('dedication');

songInput.addEventListener('input', async () => {
  if (songInput.value.length < 3) return;

  const res = await fetch(`/api/search?q=${encodeURIComponent(songInput.value)}`);
  const tracks = await res.json();

  results.innerHTML = tracks.map(t =>
    `<li data-title="${t.title}" data-artist="${t.artist}">
      ${t.title} – ${t.artist}
    </li>`
  ).join('');
});

results.addEventListener('click', e => {
  if (e.target.tagName !== 'LI') return;

  selectedTrack = {
    title: e.target.dataset.title,
    artist: e.target.dataset.artist
  };

  songInput.value = `${selectedTrack.title} – ${selectedTrack.artist}`;
  results.innerHTML = '';
});

requestForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!selectedTrack) {
    alert("Please select a song from the list");
    return;
  }

  const payload = {
    event_id: eventId,
    guest_name: guestName.value,
    song_title: selectedTrack.title,
    artist: selectedTrack.artist,
    dedication: dedication.value
  };

  const res = await fetch('/api/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    localStorage.setItem(deviceKey, 'true');
    alert("🎉 Request sent!");
    location.reload();
  }
});
