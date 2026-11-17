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

// ===== Titre de l'accueil : remplit toute la largeur =====
const heroTitle = document.querySelector('.hero-title');
const heroEl = document.querySelector('.hero');
function fitHero() {
  if (window.innerWidth <= 860) { heroEl.style.removeProperty('--hero-size'); return; }
  heroEl.style.setProperty('--hero-size', '100px');
  const range = document.createRange();
  range.selectNodeContents(heroTitle);
  const ratio = heroEl.clientWidth / range.getBoundingClientRect().width;
  const size = Math.min(100 * ratio * 0.99, window.innerHeight * 0.24);
  heroEl.style.setProperty('--hero-size', size.toFixed(1) + 'px');
}
fitHero();
document.fonts.ready.then(fitHero);
window.addEventListener('resize', fitHero);

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

// ===== Réalisations : la page part vers la droite =====
const hs = document.querySelector('.hscroll');
const hsTrack = document.querySelector('.hs-track');
const hsShots = document.querySelectorAll('.hs-shot');
let hsDistance = 0;
function sizeHscroll() {
  hsDistance = Math.max(0, hsTrack.scrollWidth - window.innerWidth);
  hs.style.setProperty('--hs-height', (window.innerHeight + hsDistance) + 'px');
}
function updateHscroll() {
  const top = hs.getBoundingClientRect().top;
  const p = hsDistance ? Math.min(1, Math.max(0, -top / hsDistance)) : 0;
  hsTrack.style.transform = `translate3d(${-p * hsDistance}px, 0, 0)`;
  hs.style.setProperty('--hs-p', p);
  // léger effet de profondeur sur les images
  hsShots.forEach((shot) => {
    const r = shot.parentElement.getBoundingClientRect();
    const offset = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth;
    shot.style.setProperty('--px', (offset * -40).toFixed(1) + 'px');
  });
}
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  sizeHscroll();
  window.addEventListener('resize', () => { sizeHscroll(); updateHscroll(); });
  document.fonts.ready.then(() => { sizeHscroll(); updateHscroll(); });
} else {
  hs.classList.add('hs-off');
}

// ===== Bouton flottant + lien actif =====
const floatCta = document.querySelector('.float-cta');
const hero = document.querySelector('.hero');
const contact = document.getElementById('contact');
function onScroll() {
  if (hsDistance) updateHscroll();
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
document.querySelectorAll('#realisations, #options, #tarifs, #faq').forEach((s) => sectionObserver.observe(s));

// ===== Apparitions douces =====
document.querySelectorAll('.offer').forEach((el) => el.classList.add('fade'));
const fadeObserver = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
  }),
  { threshold: 0, rootMargin: '0px 0px -10% 0px' }
);
document.querySelectorAll('.fade').forEach((el) => fadeObserver.observe(el));

// ===== Options sur mesure + panier =====
// ⚠️ Prix indicatifs à ajuster. unit: "once" = payé une fois, "month" = par mois.
const OPTIONS = [
  { id: 'autoreply', title: 'Réponse automatique aux demandes', desc: 'Le client reçoit un message à votre nom dès qu\'il remplit le formulaire, et vous êtes prévenu avec son numéro pour le rappeler.', points: ['Email ou SMS', 'Bouton « Rappeler »', 'Jour et nuit'], price: 15, unit: 'month', stat: '×7 plus de chances en rappelant dans l\'heure', demo: 'demo-autoreply' },
  { id: 'rdv', title: 'Prise de rendez-vous en ligne', desc: 'Vos clients réservent un créneau directement sur le site, ajouté à votre agenda.', points: ['Rappels automatiques', 'Synchro agenda'], price: 150, unit: 'once' },
  { id: 'avis', title: 'Avis Google automatiques', desc: 'Après une prestation, le client reçoit une invitation à laisser un avis sur votre fiche Google.', points: ['Plus d\'avis', 'Meilleur classement local'], price: 10, unit: 'month' },
  { id: 'devis', title: 'Devis en ligne guidé', desc: 'Un formulaire en quelques étapes qui qualifie la demande avant même votre appel.', points: ['Questions sur mesure', 'Photos jointes'], price: 250, unit: 'once' },
  { id: 'galerie', title: 'Galerie avant / après', desc: 'Montrez vos réalisations avec un curseur avant / après qui met en valeur votre travail.', points: ['Ajout facile de photos'], price: 100, unit: 'once' },
  { id: 'appel', title: 'Bouton d\'appel et WhatsApp', desc: 'Toujours visible sur téléphone : vos clients vous joignent en un geste.', points: ['Sur mobile', 'Suivi des clics'], price: 50, unit: 'once' },
  { id: 'page', title: 'Page supplémentaire', desc: 'Une page de plus pour un service, une zone d\'intervention ou une offre.', points: ['Optimisée pour Google'], price: 80, unit: 'once' },
  { id: 'entretien', title: 'Entretien du site', desc: 'Hébergement, nom de domaine, mises à jour, sécurité et modifications.', points: ['Sans prise de tête'], price: 100, unit: 'month' },
];

const optGrid = document.getElementById('opt-grid');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const euro = (n) => n.toLocaleString('fr-FR') + ' €';
const priceLabel = (o) => euro(o.price) + (o.unit === 'month' ? ' / mois' : '');
const selected = new Set();

optGrid.innerHTML = OPTIONS.map((o) => `
  <label class="opt" data-id="${o.id}">
    <input type="checkbox" value="${o.id}" />
    <div class="opt-head"><span class="opt-title">${o.title}</span><span class="opt-box" aria-hidden="true"></span></div>
    <p class="opt-desc">${o.desc}</p>
    ${o.stat ? `<span class="opt-stat">${o.stat}</span>` : ''}
    <ul class="opt-points">${o.points.map((p) => `<li>${p}</li>`).join('')}</ul>
    <div class="opt-foot">
      <span class="opt-price">${euro(o.price)}${o.unit === 'month' ? ' <small>/ mois</small>' : ' <small>une fois</small>'}</span>
      ${o.demo ? `<button type="button" class="opt-demo" data-demo="${o.demo}">Voir la démo</button>` : ''}
    </div>
  </label>`).join('');

function renderCart() {
  const list = OPTIONS.filter((o) => selected.has(o.id));
  cartItems.innerHTML = list.map((o) => `<li><span>${o.title}</span><span>${priceLabel(o)}<button type="button" data-remove="${o.id}" aria-label="Retirer ${o.title}">✕</button></span></li>`).join('');
  cartEmpty.hidden = list.length > 0;
  document.getElementById('cart-once').textContent = euro(list.filter((o) => o.unit === 'once').reduce((t, o) => t + o.price, 0));
  document.getElementById('cart-month').textContent = euro(list.filter((o) => o.unit === 'month').reduce((t, o) => t + o.price, 0)) + ' / mois';
  optGrid.querySelectorAll('.opt').forEach((card) => {
    const on = selected.has(card.dataset.id);
    card.classList.toggle('is-on', on);
    card.querySelector('input').checked = on;
  });
  try { localStorage.setItem('selection', JSON.stringify([...selected])); } catch (e) {}
}
optGrid.addEventListener('change', (e) => {
  const id = e.target.value;
  e.target.checked ? selected.add(id) : selected.delete(id);
  renderCart();
});
cartItems.addEventListener('click', (e) => {
  const id = e.target.dataset.remove;
  if (id) { selected.delete(id); renderCart(); }
});
try { JSON.parse(localStorage.getItem('selection') || '[]').forEach((id) => selected.add(id)); } catch (e) {}
renderCart();

// Le panier pré-remplit le formulaire de contact
document.getElementById('cart-cta').addEventListener('click', () => {
  const list = OPTIONS.filter((o) => selected.has(o.id));
  const msg = document.getElementById('f-message');
  const lines = list.length
    ? 'Bonjour, je suis intéressé par un site sur mesure avec les options suivantes :\n' + list.map((o) => '- ' + o.title + ' (' + priceLabel(o) + ')').join('\n')
    : 'Bonjour, je suis intéressé par un site sur mesure.';
  msg.value = lines + '\n\nMon activité : ';
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { msg.focus(); msg.setSelectionRange(msg.value.length, msg.value.length); }, 700);
});

// Fenêtres de démo
optGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('.opt-demo');
  if (!btn) return;
  e.preventDefault();
  document.getElementById(btn.dataset.demo).showModal();
});
document.querySelectorAll('dialog.demo').forEach((d) => {
  d.querySelector('.demo-close').addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
});

// ===== Démo de la réponse automatique (tourne en boucle quand elle est visible) =====
const arStage = document.querySelector('.ar-stage');
const arFields = arStage.querySelectorAll('.ar-type');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let arRunning = false;
async function typeInto(el) {
  el.textContent = '';
  el.classList.add('typing');
  for (const ch of el.dataset.text) { el.textContent += ch; await wait(55); }
  el.classList.remove('typing');
}
async function runAutoReply() {
  if (arRunning) return;
  arRunning = true;
  while (arStage.dataset.visible === '1') {
    arStage.className = 'ar-stage';
    arFields.forEach((f) => (f.textContent = ''));
    await wait(600);
    for (const f of arFields) { await typeInto(f); await wait(250); }
    await wait(300);
    arStage.classList.add('sent');
    await wait(900);
    arStage.classList.add('msg1');
    await wait(1400);
    arStage.classList.add('msg2');
    await wait(3500);
  }
  arRunning = false;
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  arFields.forEach((f) => (f.textContent = f.dataset.text));
  arStage.classList.add('sent', 'msg1', 'msg2');
} else {
  new IntersectionObserver((entries) => entries.forEach((e) => {
    arStage.dataset.visible = e.isIntersecting ? '1' : '0';
    if (e.isIntersecting) runAutoReply();
  }), { threshold: 0.35 }).observe(arStage);
}

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
