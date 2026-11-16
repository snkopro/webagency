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
