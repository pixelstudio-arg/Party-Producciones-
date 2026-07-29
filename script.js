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

// ─── FORM SUBMIT → WHATSAPP ───
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre     = form.nombre.value.trim();
    const tipoEvento = form.tipo_evento.options[form.tipo_evento.selectedIndex].text;
    const fecha      = form.fecha_evento.value;
    const lugar      = form.lugar_evento.value.trim();
    const whatsapp   = form.whatsapp.value.trim();
    const serviciosSeleccionados = [...form.querySelectorAll('input[name="servicios"]:checked')]
      .map(cb => cb.value);

    const fechaFormateada = fecha
      ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : 'Sin fecha definida';

    let texto =
      `🎉 *NUEVA CONSULTA - PARTY PRODUCCIONES*\n\n` +
      `👤 *Nombre:* ${nombre}\n` +
      `🎊 *Tipo de evento:* ${tipoEvento}\n` +
      `📅 *Fecha:* ${fechaFormateada}\n` +
      `📍 *Lugar:* ${lugar || 'No especificado'}\n` +
      `📱 *WhatsApp:* ${whatsapp}`;

    if (serviciosSeleccionados.length > 0) {
      texto += `\n\n🎯 *Servicios que le interesan:*\n${serviciosSeleccionados.map(s => `• ${s}`).join('\n')}`;
    } else {
      texto += `\n\n🎯 *Servicios:* No especificó (consultar)`;
    }

    const url = `https://wa.me/5493512088004?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');

    form.style.display = 'none';
    formSuccess.style.display = 'block';
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
