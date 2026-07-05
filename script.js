// ─── MÚSICA DE FONDO ───
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const iconPlay  = musicToggle.querySelector('.music-icon--play');
const iconPause = musicToggle.querySelector('.music-icon--pause');
let musicStarted = false;

bgMusic.volume = 0.35;

musicToggle.addEventListener('click', () => {
  if (!musicStarted) {
    bgMusic.play().then(() => {
      musicStarted = true;
      setPlaying(true);
    }).catch(() => {});
  } else if (bgMusic.paused) {
    bgMusic.play();
    setPlaying(true);
  } else {
    bgMusic.pause();
    setPlaying(false);
  }
});

function setPlaying(playing) {
  iconPlay.style.display  = playing ? 'none' : 'block';
  iconPause.style.display = playing ? 'block' : 'none';
  musicToggle.classList.toggle('playing', playing);
}

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── MOBILE NAV TOGGLE ───
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.value-card, .service-card, .gallery-item, .step, .trust-chip, .trust-stats .stat'
).forEach((el, i) => {
  el.classList.add('fade-in-up');
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// ─── FORM SUBMIT ───
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    const action = form.getAttribute('action');
    // If Formspree ID not yet configured, handle gracefully
    if (action.includes('[COMPLETAR_ID_FORMSPREE]')) {
      e.preventDefault();
      form.style.display = 'none';
      formSuccess.style.display = 'block';
      return;
    }

    e.preventDefault();
    const data = new FormData(form);

    try {
      const res = await fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      } else {
        alert('Hubo un error al enviar. Por favor escribinos por WhatsApp.');
      }
    } catch {
      alert('Hubo un error al enviar. Por favor escribinos por WhatsApp.');
    }
  });
}

// ─── LAZY VIDEO LOADING ───
// Pause videos not in viewport to save mobile battery/data
const videos = document.querySelectorAll('video');
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.play().catch(() => {});
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.1 });

videos.forEach(v => {
  // Don't observe hero video — always playing
  if (!v.closest('.hero-bg')) {
    videoObserver.observe(v);
  }
});
