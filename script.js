
const YEAR = document.getElementById('year'); if (YEAR) YEAR.textContent = new Date().getFullYear();
const root = document.getElementById('coverflow');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let index = 0;

function build(){
  root.innerHTML = '';
  window.COVERS.forEach((c,i) => {
    const card = document.createElement('a');
    card.href = c.src; card.target = "_blank"; card.rel="noopener";
    card.className = 'card';
    const img = document.createElement('img');
    img.src = c.src; img.alt = c.title;
    card.appendChild(img);
    root.appendChild(card);
  });
}

function layout(){
  const cards = Array.from(root.children);
  const n = cards.length;
  cards.forEach(c => { c.className = 'card'; c.style.opacity = 0; });
  cards.forEach((c,i) => {
    let p = i - index;
    if (p > n/2) p -= n;
    if (p < -n/2) p += n;
    c.style.opacity = 1;
    if (p === 0) c.classList.add('center');
    else if (p === -1) c.classList.add('left1');
    else if (p === -2) c.classList.add('left2');
    else if (p === 1) c.classList.add('right1');
    else if (p === 2) c.classList.add('right2');
    else c.style.opacity = 0;
  });
}

function next(){ index = (index + 1) % window.COVERS.length; layout(); }
function prev(){ index = (index - 1 + window.COVERS.length) % window.COVERS.length; layout(); }

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);
build();
layout();
window.addEventListener('resize', layout);
