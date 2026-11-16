// ===== Header =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 10), { passive: true });

// ===== Menu mobile =====
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
function setMenu(open) {
  burger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
}
burger.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

// ===== Le chantier : le site se construit pendant qu'on descend =====
const build = document.querySelector('.build');
const buildLabel = document.querySelector('.build-step');
const labels = ['Terrain vierge', 'Étape 1 : le plan', 'Étape 2 : le gros œuvre', 'Étape 3 : les finitions', 'Étape 4 : la réception', 'Étape 5 : l\'entretien'];
const stages = document.querySelectorAll('[data-stage]:not(.build)');

function setStage(n) {
  if (build.dataset.stage === String(n)) return;
  build.dataset.stage = n;
  build.classList.toggle('built', n >= 2);
  build.classList.toggle('online', n >= 4);
  buildLabel.textContent = labels[n];
  stages.forEach((s) => s.classList.toggle('is-active', s.dataset.stage === String(n)));
}

// L'étape active est celle qui passe au milieu de l'écran
function updateStage() {
  const middle = window.innerHeight * (window.innerWidth <= 960 ? 0.8 : 0.55);
  let current = 0;
  stages.forEach((s) => {
    if (s.getBoundingClientRect().top < middle) current = Number(s.dataset.stage);
  });
  setStage(current);
}
window.addEventListener('scroll', updateStage, { passive: true });
window.addEventListener('resize', updateStage);
updateStage();

// ===== Réalisations : flèches =====
const track = document.querySelector('.work-track');
document.querySelectorAll('.arrow').forEach((btn) =>
  btn.addEventListener('click', () => {
    const card = track.querySelector('.project');
    track.scrollBy({ left: (card.offsetWidth + 28) * Number(btn.dataset.dir), behavior: 'smooth' });
  })
);

// ===== FAQ : une seule réponse ouverte =====
const faqItems = document.querySelectorAll('.faq details');
faqItems.forEach((d) =>
  d.addEventListener('toggle', () => {
    if (d.open) faqItems.forEach((o) => { if (o !== d) o.open = false; });
  })
);

// ===== Lien actif dans le menu =====
const navLinks = document.querySelectorAll('.nav a');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }),
  { rootMargin: '-45% 0px -50% 0px' }
);
document.querySelectorAll('#chantier, #realisations, #tarifs, #apropos').forEach((s) => sectionObserver.observe(s));

// ===== Année =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Formulaire de contact =====
// Pour recevoir les messages directement : crée un formulaire gratuit sur https://formspree.io
// et colle l'adresse fournie ci-dessous (ex. "https://formspree.io/f/abcdwxyz").
// Tant que c'est vide, le formulaire ouvre la messagerie du visiteur avec le message pré-rempli.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'contact@tondomaine.fr';

const form = document.getElementById('contact-form');
const statusEl = form.querySelector('.form-status');

function validate() {
  let ok = true;
  form.querySelectorAll('[required]').forEach((input) => {
    const valid = input.type === 'email'
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())
      : input.value.trim() !== '';
    input.closest('.field').classList.toggle('has-error', !valid);
    if (!valid) ok = false;
  });
  return ok;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.className = 'form-status';
  if (!validate()) {
    statusEl.textContent = 'Remplissez votre nom, votre email, votre activité et votre projet.';
    statusEl.classList.add('err');
    return;
  }
  if (form._gotcha.value) return;

  const data = Object.fromEntries(new FormData(form));
  delete data._gotcha;

  if (!FORM_ENDPOINT) {
    const body = `Nom : ${data.name}\nEmail : ${data.email}\nTéléphone : ${data.phone || '-'}\nActivité : ${data.activity}\n\n${data.message}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Demande de devis — ' + data.name)}&body=${encodeURIComponent(body)}`;
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
    statusEl.textContent = 'Demande envoyée. Je vous réponds sous 24 h.';
    statusEl.classList.add('ok');
  } catch {
    statusEl.textContent = `L'envoi n'a pas abouti. Écrivez-moi directement à ${CONTACT_EMAIL}.`;
    statusEl.classList.add('err');
  } finally {
    btn.disabled = false;
  }
});

form.querySelectorAll('input, select, textarea').forEach((el) =>
  el.addEventListener('input', () => el.closest('.field')?.classList.remove('has-error'))
);
