const header = document.querySelector('[data-header]');
const progress = document.querySelector('.page-progress');
const reveals = document.querySelectorAll('.reveal');
const parallax = document.querySelector('[data-parallax]');
const cursor = document.querySelector('.cursor-dot');
const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const tiltCards = document.querySelectorAll('.tilt-card');

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = pageHeight > 0 ? (scrollTop / pageHeight) * 100 : 0;

  progress.style.width = `${percent}%`;
  header.classList.toggle('is-scrolled', scrollTop > 24);

  if (parallax) {
    const move = Math.min(scrollTop * 0.06, 60);
    parallax.style.transform = `translateY(${move}px)`;
  }
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

reveals.forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 0.035, 0.28)}s`;
  observer.observe(el);
});

if (cursor) {
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
  });

  const animateCursor = () => {
    x += (targetX - x) * 0.16;
    y += (targetY - y) * 0.16;
    cursor.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  };

  animateCursor();
}

const closeMenu = () => {
  document.body.classList.remove('menu-open');
  menuButton.classList.remove('is-active');
  menuButton.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.classList.toggle('is-active');
  document.body.classList.toggle('menu-open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.classList.toggle('is-open', isOpen);
});

mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

tiltCards.forEach(card => {
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = clamp(((x / rect.width) - 0.5) * 8, -4, 4);
    const rotateX = clamp(((y / rect.height) - 0.5) * -8, -4, 4);
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});
