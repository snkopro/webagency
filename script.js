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

// ===== Mot qui change dans le titre =====
const words = document.querySelectorAll('.rot-word');
let wi = 0;
setInterval(() => {
  const prev = words[wi];
  prev.classList.remove('is-active');
  prev.classList.add('is-leaving');
  setTimeout(() => prev.classList.remove('is-leaving'), 600);
  wi = (wi + 1) % words.length;
  words[wi].classList.add('is-active');
}, 2600);

// ===== Texte qui se révèle mot à mot au scroll =====
const panel = document.querySelector('.panel');
const revealWords = document.querySelectorAll('.reveal-text span');
function updateReveal() {
  const r = panel.getBoundingClientRect();
  const vh = window.innerHeight;
  // 0 quand le panneau entre en bas de l'écran, 1 quand son centre atteint 40 % de la hauteur
  const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.6 + r.height * 0.5)));
  const n = Math.round(progress * revealWords.length);
  revealWords.forEach((w, i) => w.classList.toggle('on', i < n));
}

// ===== Villes qui défilent =====
const cities = document.querySelectorAll('.cities-list span');
let ci = 0;
function renderCities() {
  const n = cities.length;
  cities.forEach((c, i) => {
    c.classList.toggle('is-active', i === ci);
    c.classList.toggle('is-prev', i === (ci - 1 + n) % n);
    c.classList.toggle('is-next', i === (ci + 1) % n);
  });
}
renderCities();
setInterval(() => { ci = (ci + 1) % cities.length; renderCities(); }, 2000);

// ===== Bouton flottant + lien actif =====
const floatCta = document.querySelector('.float-cta');
const hero = document.querySelector('.hero');
const contact = document.getElementById('contact');
function onScroll() {
  updateReveal();
  const pastHero = hero.getBoundingClientRect().bottom < 0;
  const atContact = contact.getBoundingClientRect().top < window.innerHeight * 0.8;
  floatCta.classList.toggle('show', pastHero && !atContact);
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }),
  { rootMargin: '-45% 0px -50% 0px' }
);
document.querySelectorAll('#realisations, #methode, #tarifs, #faq').forEach((s) => sectionObserver.observe(s));

// ===== Apparitions douces =====
document.querySelectorAll('.bento .tile, .card, .offer, .trades').forEach((el) => el.classList.add('fade'));
const fadeObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  }),
  { threshold: 0.15 }
);
document.querySelectorAll('.fade').forEach((el) => fadeObserver.observe(el));

// ===== FAQ : une seule réponse ouverte =====
const faqItems = document.querySelectorAll('.faq details');
faqItems.forEach((d) => d.addEventListener('toggle', () => {
  if (d.open) faqItems.forEach((o) => { if (o !== d) o.open = false; });
}));

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
