// Caynan Captures v5 — GitHub-Safe Version (No Exposed Key)
// Works with public Supabase bucket + fallback covers
// Includes live captions that auto-wrap for long names

const YEAR = document.getElementById('year');
if (YEAR) YEAR.textContent = new Date().getFullYear();

// Define a default empty array so build() never breaks
window.COVERS = [];

// DOM Elements
const root = document.getElementById('coverflow');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let index = 0;

// Build carousel with captions
function build() {
  root.innerHTML = '';
  if (!window.COVERS || window.COVERS.length === 0) return;

  window.COVERS.forEach((c) => {
    const card = document.createElement('a');
    card.href = c.src;
    card.target = "_blank";
    card.rel = "noopener";
    card.className = 'card';

    const img = document.createElement('img');
    img.src = c.src;
    img.alt = c.title;
    card.appendChild(img);

    // Caption overlay
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = c.title;
    card.appendChild(caption);

    root.appendChild(card);
  });
}

// Layout for 3D effect
function layout() {
  const cards = Array.from(root.children);
  const n = cards.length;
  cards.forEach(c => { c.className = 'card'; c.style.opacity = 0; });
  cards.forEach((c, i) => {
    let p = i - index;
    if (p > n / 2) p -= n;
    if (p < -n / 2) p += n;
    c.style.opacity = 1;
    if (p === 0) c.classList.add('center');
    else if (p === -1) c.classList.add('left1');
    else if (p === -2) c.classList.add('left2');
    else if (p === 1) c.classList.add('right1');
    else if (p === 2) c.classList.add('right2');
    else c.style.opacity = 0;
  });
}

// Controls
function next() { index = (index + 1) % window.COVERS.length; layout(); }
function prev() { index = (index - 1 + window.COVERS.length) % window.COVERS.length; layout(); }
nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
window.addEventListener('resize', layout);

// Fallback covers
function fallbackCovers() {
  window.COVERS = [
    { title: 'Pulaski Co vs Somerset', src: 'assets/covers/pulaski_vs_somerset_volleyball.jpg' },
    { title: 'Somerset vs Southwestern', src: 'assets/covers/somerset_vs_southwestern_football.jpg' },
    { title: 'Lincoln Co vs Casey Co', src: 'assets/covers/lincoln_co_vs_casey_co_basketball.jpg' },
    { title: 'Pulaski Co Cheer Invitational', src: 'assets/covers/pulaski_co_cheer_invitational.jpg' },
    { title: 'Somerset Baseball', src: 'assets/covers/somerset_baseball.jpg' },
    { title: 'Somerset vs Football', src: 'assets/covers/somerset_vs_football.jpg' }
  ];
  build();
  layout();
}

// Load from Supabase (public bucket)
async function loadCoversFromSupabase() {
  try {
    const { data, error } = await supabase.storage.from('proofs').list('', { limit: 30 });

    if (error) {
      console.warn("Supabase error:", error.message);
      return fallbackCovers();
    }

    if (!data || data.length === 0) {
      console.log("No images in Supabase — using fallback covers.");
      return fallbackCovers();
    }

    window.COVERS = data.map(file => ({
      title: file.name.replace(/\.[^/.]+$/, ''),
      src: `${SUPABASE_URL}/storage/v1/object/public/proofs/${file.name}`
    }));

    console.log("Loaded from Supabase:", window.COVERS);
    build();
    layout();
  } catch (err) {
    console.error("Unexpected error:", err);
    fallbackCovers();
  }
}

// Initialize safely
loadCoversFromSupabase();
