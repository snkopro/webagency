const hero = document.querySelector('.hero');
const titles = document.querySelectorAll('.title');
const wrap = document.querySelector('.title-wrap');

// Taille du titre : la ligne la plus longue remplit toute la largeur
function fitTitle() {
  const probe = document.querySelector('.title-top .l2');
  hero.style.setProperty('--title-size', '100px');
  const range = document.createRange();
  range.selectNodeContents(probe);
  const ratio = wrap.clientWidth / range.getBoundingClientRect().width;
  const size = Math.min(100 * ratio, window.innerHeight * 0.25);
  hero.style.setProperty('--title-size', size + 'px');
}
document.fonts.ready.then(fitTitle);
window.addEventListener('resize', fitTitle);

// Survol : la ligne survolée devient pleine
document.querySelectorAll('.title-top .line').forEach((line) => {
  line.addEventListener('mouseenter', () => {
    hero.dataset.active = line.dataset.line;
    cursor.classList.add('show');
  });
  line.addEventListener('mouseleave', () => cursor.classList.remove('show'));
});

// Curseur rond qui suit la souris
const cursor = document.querySelector('.cursor');
let mx = 0, my = 0, cx = 0, cy = 0;
window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
(function loop() {
  cx += (mx - cx) * 0.2;
  cy += (my - cy) * 0.2;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(loop);
})();

// Écran de chargement : on le retire du DOM après l'animation
const loader = document.querySelector('.loader');
loader.addEventListener('animationend', (e) => {
  if (e.animationName === 'loaderOut') loader.remove();
});

// Menu mobile
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Ferme le menu mobile quand on clique sur un lien
mobileMenu.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

// Apparition douce au scroll
const revealObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Filtres des réalisations
const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
filters.forEach((btn) =>
  btn.addEventListener('click', () => {
    filters.forEach((b) => b.classList.toggle('is-active', b === btn));
    const f = btn.dataset.filter;
    projects.forEach((p) => p.classList.toggle('is-hidden', f !== 'all' && p.dataset.cat !== f));
  })
);

// Année du footer
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Formulaire de contact =====
// Pour recevoir les messages directement : crée un formulaire gratuit sur https://formspree.io
// et colle l'adresse fournie ci-dessous (ex. "https://formspree.io/f/abcdwxyz").
// Tant que c'est vide, le formulaire ouvre l'email du visiteur avec le message pré-rempli.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'contact@tondomaine.fr';

const form = document.getElementById('contact-form');
const statusEl = form.querySelector('.form-status');

function validate() {
  let ok = true;
  form.querySelectorAll('[required]').forEach((input) => {
    const field = input.closest('.field');
    const valid = input.type === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
      : input.value.trim() !== '';
    field.classList.toggle('has-error', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.className = 'form-status';
  if (!validate()) {
    statusEl.textContent = 'Merci de remplir les champs obligatoires.';
    statusEl.classList.add('err');
    return;
  }
  if (form._gotcha.value) return; // anti-spam

  const data = Object.fromEntries(new FormData(form));
  delete data._gotcha;

  if (!FORM_ENDPOINT) {
    const body = `Nom : ${data.name}\nEmail : ${data.email}\nTéléphone : ${data.phone || '-'}\nActivité : ${data.activity}\n\n${data.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demande de site — ' + data.name)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  statusEl.textContent = 'Envoi en cours…';
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error();
    form.reset();
    statusEl.textContent = 'Merci ! Votre demande est bien envoyée, je vous réponds sous 24 h.';
    statusEl.classList.add('ok');
  } catch {
    statusEl.textContent = `Oups, l'envoi a échoué. Écrivez-moi directement à ${CONTACT_EMAIL}.`;
    statusEl.classList.add('err');
  } finally {
    btn.disabled = false;
  }
});

form.querySelectorAll('input, select, textarea').forEach((el) =>
  el.addEventListener('input', () => el.closest('.field')?.classList.remove('has-error'))
);
