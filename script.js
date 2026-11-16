// Header : bordure au scroll
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// Menu mobile
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
  })
);

// Mot qui tourne dans le hero
const words = document.querySelectorAll('.rotator-word');
let current = 0;
setInterval(() => {
  const prev = words[current];
  prev.classList.remove('is-active');
  prev.classList.add('is-leaving');
  setTimeout(() => prev.classList.remove('is-leaving'), 500);
  current = (current + 1) % words.length;
  words[current].classList.add('is-active');
}, 2400);

// Apparition douce au scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Carrousel réalisations
const carousel = document.querySelector('.carousel');
document.querySelectorAll('.arrow').forEach((btn) =>
  btn.addEventListener('click', () => {
    const card = carousel.querySelector('.project');
    const step = card.offsetWidth + 20;
    carousel.scrollBy({ left: step * Number(btn.dataset.dir), behavior: 'smooth' });
  })
);
