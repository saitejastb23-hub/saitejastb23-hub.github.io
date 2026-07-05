const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();

const progress = document.querySelector('.progress-bar');
const updateProgress = () => {
  if (!progress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progress.style.width = `${pct}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  reveals.forEach(el => revealObserver.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--x', `${x}%`);
    card.style.setProperty('--y', `${y}%`);
  });
});

const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }, { passive: true });
}

const terminalText = document.querySelector('[data-typewriter]');
if (terminalText) {
  const lines = [
    'rag.ingest(docs) → citations',
    'agent.plan(task) → tool_route',
    'eval.check(answer) → grounded',
    'deploy.fastapi() → production'
  ];
  let line = 0;
  let char = 0;
  let deleting = false;
  function typeLoop() {
    const current = lines[line];
    terminalText.textContent = current.slice(0, char);
    if (!deleting && char < current.length) char++;
    else if (!deleting && char === current.length) { deleting = true; setTimeout(typeLoop, 1150); return; }
    else if (deleting && char > 0) char--;
    else { deleting = false; line = (line + 1) % lines.length; }
    setTimeout(typeLoop, deleting ? 28 : 54);
  }
  typeLoop();
}

const canvas = document.getElementById('orb-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const colors = ['rgba(34,211,238,', 'rgba(139,92,246,', 'rgba(34,197,94,'];
  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    const count = Math.min(80, Math.floor(window.innerWidth / 18));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
      r: (Math.random() * 1.8 + 0.8) * devicePixelRatio,
      c: colors[i % colors.length]
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, idx) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `${p.c}0.45)`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      for (let j = idx + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        const maxDist = 145 * devicePixelRatio;
        if (dist < maxDist) {
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.08 * (1 - dist/maxDist)})`;
          ctx.lineWidth = 1 * devicePixelRatio;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize);
  draw();
}
