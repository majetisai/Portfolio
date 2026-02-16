/* ==========================================================
   MISSION: DEPLOY SAI – Interactive Gamified Portfolio
   JavaScript: Particles, Scroll Unlock, XP, Modals, Typing
   ========================================================== */

// ==================== CONFIGURATION ====================
const CONFIG = {
  xpPerLevel: [0, 100, 200, 350, 500, 700],
  typingText: 'Applied Computer Science | Data & IT Specialist',
  typingSpeed: 55,
  particleCount: 80,
  particleSpeed: 0.4,
};

// Project data for modals
const PROJECTS = {
  1: {
    rank: 'MISSION 01',
    title: 'Enterprise-Style E-Commerce Application',
    tech: ['Django', 'MySQL', 'AWS EC2', 'AWS RDS'],
    date: 'Jan 2024 – May 2024',
    details: [
      'Designed and configured end-to-end ERP-style workflows including product management, order processing, user authentication, and reporting.',
      'Conducted unit and integration testing, validated data integrity, and ensured system availability.',
      'Deployed and maintained the application on AWS EC2 with RDS and S3, simulating real-world enterprise system support.',
    ],
  },
  2: {
    rank: 'MISSION 02',
    title: 'Sales Insights & Revenue Analytics Dashboard',
    tech: ['SQL', 'Power BI'],
    date: 'Feb 2023 – Jun 2023',
    details: [
      'Collaborated on business requirement analysis using an AIMS grid to translate needs into technical solutions.',
      'Built ETL pipelines in MySQL, ensured data accuracy, and developed dashboards for revenue, trends, and regional performance.',
      'Created documentation and user-friendly reports to support data-driven decision-making.',
    ],
  },
  3: {
    rank: 'MISSION 03',
    title: 'COVID-19 Data Analysis',
    tech: ['Excel'],
    date: 'Nov 2021 – Jan 2022',
    details: [
      'Cleaned and analyzed large datasets to identify trends, anomalies, and regional patterns.',
      'Built visualizations and pivot tables to communicate insights clearly to non-technical audiences.',
      'Ensured data integrity and accuracy, aligning with enterprise reporting standards.',
    ],
  },
  4: {
    rank: 'MISSION 04',
    title: 'Matrimony Website',
    tech: ['HTML', 'CSS', 'JavaScript'],
    date: 'Aug 2019 – Oct 2019',
    details: [
      'Developed a responsive Matrimony website with secure user authentication.',
      'Designed an intuitive user interface for profile creation, matchmaking, and dynamic filtering.',
      'Optimized performance and navigation across devices to ensure a seamless user experience.',
    ],
  },
};

// ==================== STATE ====================
let gameStarted = false;
let currentXP = 0;
let unlockedLevels = new Set([0]);
let animatedStats = false;

// ==================== DOM REFERENCES ====================
const hud = document.getElementById('game-hud');
const xpCounter = document.getElementById('xp-counter');
const levelDots = document.querySelectorAll('.level-dot');
const progressFill = document.getElementById('level-progress-fill');
const startBtn = document.getElementById('start-btn');
const scrollHint = document.getElementById('scroll-hint');
const modal = document.getElementById('project-modal');
const contactForm = document.getElementById('contact-form');

// ==================== PARTICLE BACKGROUND ====================
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrameId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * CONFIG.particleSpeed,
        speedY: (Math.random() - 0.5) * CONFIG.particleSpeed,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 60;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw particles
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${p.opacity})`;
      ctx.fill();

      // Move
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animFrameId = requestAnimationFrame(draw);
  }

  resize();
  createParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
}

// ==================== TYPING EFFECT ====================
function typeText(elementId, text, speed) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent = '';
  let i = 0;

  function type() {
    if (i < text.length) {
      el.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// ==================== XP SYSTEM ====================
function addXP(amount) {
  const target = currentXP + amount;
  const duration = 600;
  const start = currentXP;
  const startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out
    const eased = 1 - Math.pow(1 - progress, 3);
    currentXP = Math.round(start + (target - start) * eased);
    xpCounter.textContent = currentXP;

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

function updateLevelDots() {
  const totalLevels = CONFIG.xpPerLevel.length;
  let currentLevel = 0;

  for (let i = totalLevels - 1; i >= 0; i--) {
    if (currentXP >= CONFIG.xpPerLevel[i]) {
      currentLevel = i;
      break;
    }
  }

  levelDots.forEach((dot, index) => {
    dot.classList.remove('active', 'completed');
    if (index < currentLevel) {
      dot.classList.add('completed');
    } else if (index === currentLevel) {
      dot.classList.add('active');
    }
  });

  // Update progress fill
  const pct = (currentLevel / (totalLevels - 1)) * 100;
  progressFill.style.width = pct + '%';
}

// ==================== LEVEL UNLOCK SYSTEM ====================
function unlockLevel(levelNum) {
  if (unlockedLevels.has(levelNum)) return;
  unlockedLevels.add(levelNum);

  const section = document.getElementById('level-' + levelNum);
  if (!section) return;

  section.classList.add('unlocking');
  section.classList.remove('locked');

  // Show unlock flash
  const flash = section.querySelector('.unlock-flash');
  if (flash) {
    flash.classList.add('show');
    setTimeout(() => flash.classList.remove('show'), 1500);
  }

  // Add XP
  const xpReward = CONFIG.xpPerLevel[levelNum] || 0;
  addXP(xpReward);
  setTimeout(() => updateLevelDots(), 100);

  // Animate stat bars if Level 1
  if (levelNum === 1) {
    setTimeout(animateStatBars, 500);
  }

  // Add reveal animations to children
  setTimeout(() => {
    section.classList.remove('unlocking');
    revealChildren(section);
  }, 800);
}

// ==================== STAT BAR ANIMATION ====================
function animateStatBars() {
  if (animatedStats) return;
  animatedStats = true;

  const statItems = document.querySelectorAll('#level-1 .stat-item');
  statItems.forEach((item, index) => {
    const percent = item.getAttribute('data-percent');
    const fill = item.querySelector('.stat-fill');
    setTimeout(() => {
      fill.style.width = percent + '%';
    }, index * 150);
  });
}

// ==================== SCROLL-BASED UNLOCK ====================
function handleScroll() {
  if (!gameStarted) return;

  const scrollY = window.scrollY;
  const windowH = window.innerHeight;

  // Check each level section
  for (let i = 1; i <= 5; i++) {
    const section = document.getElementById('level-' + i);
    if (!section) continue;

    const rect = section.getBoundingClientRect();
    // Unlock when section is 30% in view
    if (rect.top < windowH * 0.7) {
      unlockLevel(i);
    }
  }
}

// ==================== SCROLL REVEAL FOR CHILD ELEMENTS ====================
function revealChildren(parent) {
  const revealEls = parent.querySelectorAll(
    '.character-card, .stats-panel, .skill-category, .mission-card, .timeline-node, .cert-badge, .boss-content'
  );
  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

// ==================== PROJECT MODAL ====================
function openModal(projectId) {
  const data = PROJECTS[projectId];
  if (!data) return;

  document.getElementById('modal-rank').textContent = data.rank;
  document.getElementById('modal-title').textContent = data.title;
  document.getElementById('modal-date').textContent = data.date;

  // Tech tags
  const techContainer = document.getElementById('modal-tech');
  techContainer.innerHTML = data.tech
    .map((t) => `<span class="tech-tag">${t}</span>`)
    .join('');

  // Details
  const bodyContainer = document.getElementById('modal-body');
  bodyContainer.innerHTML =
    '<ul>' + data.details.map((d) => `<li>${d}</li>`).join('') + '</ul>';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ==================== CONTACT FORM ====================
async function handleFormSubmit(e) {
  e.preventDefault();

  const successMsg = document.getElementById('form-success');
  const errorMsg = document.getElementById('form-error');
  const submitBtn = contactForm.querySelector('.submit-btn');

  // Hide previous messages
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';

  // Disable button while sending
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = '⏳ TRANSMITTING...';

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  try {
    await fetch('https://script.google.com/macros/s/AKfycbwv-CBDPHVp-zxWYz7Mz5Yc18b4bBTp3l6zCyHhB2MjIzCwWglQnsr_fBgGxkFPgimm/exec', {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });

    // Google Apps Script redirects response, so we assume success if no network error
    successMsg.style.display = 'block';
    contactForm.reset();
    setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
  } catch (err) {
    errorMsg.style.display = 'block';
    setTimeout(() => { errorMsg.style.display = 'none'; }, 5000);
  }

  // Re-enable button
  submitBtn.disabled = false;
  submitBtn.querySelector('.btn-text').textContent = '🚀 DEPLOY MESSAGE';
}

// ==================== START GAME ====================
function startGame() {
  if (gameStarted) return;
  gameStarted = true;

  // Show HUD
  hud.classList.add('visible');

  // Show scroll hint
  if (scrollHint) scrollHint.style.display = 'block';

  // Start typing effect
  typeText('subtitle-text', CONFIG.typingText, CONFIG.typingSpeed);

  // Add initial XP
  addXP(50);
  updateLevelDots();

  // Smooth scroll to Level 1 after a brief delay
  setTimeout(() => {
    document.getElementById('level-1').scrollIntoView({ behavior: 'smooth' });
  }, 800);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize particles
  initParticles();

  // Start typing on landing
  typeText('subtitle-text', CONFIG.typingText, CONFIG.typingSpeed);

  // Start button
  startBtn.addEventListener('click', startGame);

  // Scroll listener
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Project modal buttons
  document.querySelectorAll('.mission-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  // Close modal
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Contact form
  contactForm.addEventListener('submit', handleFormSubmit);

  // Level dot clicks (navigate to section)
  levelDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const lvl = dot.getAttribute('data-level');
      const section = document.getElementById('level-' + lvl);
      if (section && !section.classList.contains('locked')) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
    dot.style.cursor = 'pointer';
  });
});
