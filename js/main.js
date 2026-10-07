// Failsafe state
let isPreloaderDismissed = false;

function dismissPreloader() {
  if (isPreloaderDismissed) return;
  isPreloaderDismissed = true;
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 700);
  }
  document.body.classList.remove('no-scroll');
}

function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('preloader-counter-val');
  if (!preloader) {
    document.body.classList.remove('no-scroll');
    return;
  }

  // Click or keydown dismiss immediately
  preloader.addEventListener('click', dismissPreloader);
  window.addEventListener('keydown', dismissPreloader, { once: true });

  // Unconditional failsafe timer: max 1.5s then ALWAYS dismiss
  const safetyTimer = setTimeout(() => {
    if (counterEl) counterEl.textContent = '100';
    dismissPreloader();
  }, 1500);

  if (!counterEl) {
    dismissPreloader();
    return;
  }

  let start = null;
  const duration = 1200; // ms

  function step(timestamp) {
    if (isPreloaderDismissed) return;
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    
    // Smooth ease-out curve
    const easeOutVal = 1 - Math.pow(1 - progress, 3);
    const count = Math.round(easeOutVal * 100);
    counterEl.textContent = count;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      clearTimeout(safetyTimer);
      setTimeout(dismissPreloader, 150);
    }
  }

  requestAnimationFrame(step);
}

function initApp() {
  // 1. Interactive Preloader
  initPreloader();

  // 2. Real-Time IST World Clock
  initLiveClock();

  // 3. Mobile Drawer Navigation
  initMobileNav();

  // 4. Projects Category Filter
  initProjectFilters();

  // 5. Interactive Project & Bio Modals
  initModals();

  // 6. Contact Form Handling
  initContactForm();

  // 7. Active Nav Link on Scroll
  initScrollSpy();
}

// Immediate execution or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   2. Real-Time Studio Clock (IST Mumbai)
   ========================================================================== */
function initLiveClock() {
  const clockEl = document.getElementById('live-clock');
  if (!clockEl) return;

  function tick() {
    const now = new Date();
    // Format to Asia/Kolkata (Mumbai) time
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `${timeString} IST`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   4. Projects Category Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Interactive Project & Bio Modals
   ========================================================================== */
const projectData = {
  'nolandsman': {
    title: "No Land's Man",
    category: "International Feature Film",
    poster: "images/nolandsman_poster.jpg",
    logline: "A poignant, globe-trotting drama about identity, displacement, and love amidst escalating global xenophobia and religious profiling.",
    synopsis: "No Land's Man follows a South Asian man whose journey through America and Australia forces him into a maze of complex identities, deception, and moral survival. Produced in collaboration with Academy Award-winning maestro A.R. Rahman and acclaimed director Mostofa Sarwar Farooki, the film stars Nawazuddin Siddiqui alongside Megan Mitchell in an unforgettable performance.",
    meta: {
      "Director": "Mostofa Sarwar Farooki",
      "Producers": "Side Hero Entertainment, A.R. Rahman, Mostofa Sarwar Farooki",
      "Music Composer": "A.R. Rahman",
      "Starring": "Nawazuddin Siddiqui & Megan Mitchell",
      "Language": "English, Hindi, Bengali",
      "Format": "Feature Film (Cinema 4K)"
    }
  },
  'section108': {
    title: "Section 108",
    category: "Thriller / Feature Film",
    poster: "images/section108_thumb.jpg",
    logline: "A high-stakes investigative thriller delving into financial deception, corporate disappearance, and clandestine judicial loopholes.",
    synopsis: "Section 108 presents an intense investigative narrative led by Nawazuddin Siddiqui and Regina Cassandra. When a high-profile case involving sudden disappearances and corporate insurance scams unravels, an unconventional investigator pieces together clues that defy legal statutes.",
    meta: {
      "Director": "Rasikh Khan",
      "Producers": "Cinemawala & Side Hero Entertainment",
      "Starring": "Nawazuddin Siddiqui, Regina Cassandra",
      "Genre": "Investigative Thriller",
      "Status": "Theatrical Release"
    }
  },
  'arthi': {
    title: "Arthi",
    category: "Acclaimed Debut Feature",
    poster: "images/arthi_poster.jpg",
    logline: "A soul-stirring drama unravelling human fragility, deep-seated family expectations, and the silence between spoken words.",
    synopsis: "Penned and created by Faizuddin Siddiqui and directed by Utkarsh Kakaria, Arthi earned critical acclaim across national and international film festivals. The story captures raw human relationships with empathy, authentic pacing, and unflinching realism.",
    meta: {
      "Director": "Utkarsh Kakaria",
      "Created By": "Faizuddin Siddiqui",
      "Producer": "Side Hero Entertainment Pvt. Ltd.",
      "Accolades": "Official Festival Selections & Critical Acclaim",
      "Genre": "Human Drama"
    }
  },
  'adhurakhvaab': {
    title: "Adhura Khvaab",
    category: "Feature Film",
    poster: "images/adhura_poster.jpg",
    logline: "An evocative story of unfulfilled ambitions, heartbreaks, and quiet resilience in an unforgiving urban world.",
    synopsis: "Created by Faizuddin Siddiqui and directed by Shadab Khan, Adhura Khvaab explores the contrast between youthful romanticism and the bitter compromises of adult survival. Starring Sonia Sharma and Ali Merchant, it was showcased at prestigious film festivals in India and abroad.",
    meta: {
      "Director": "Shadab Khan",
      "Created By": "Faizuddin Siddiqui",
      "Producer": "Side Hero Entertainment Pvt. Ltd.",
      "Starring": "Sonia Sharma & Ali Merchant",
      "Genre": "Drama / Romance"
    }
  },
  'costao': {
    title: "COSTAO",
    category: "Crime Drama / Feature Film",
    poster: "images/costao.jpg",
    logline: "A gritty, atmospheric descent into the corridors of power, unspoken codes, and inevitable reckonings.",
    synopsis: "A collaboration between Bhanushali Studios, Side Hero Entertainment, and Bombay Fables. Starring Nawazuddin Siddiqui and Priya Bapat, COSTAO combines sharp cinematic storytelling with a powerful ensemble cast under the visionary direction of Sejal Shah and Bhavesh Mandalia.",
    meta: {
      "Directors": "Sejal Shah & Bhavesh Mandalia",
      "Producers": "Bhanushali Studios, Side Hero Entertainment, Bombay Fables",
      "Starring": "Nawazuddin Siddiqui & Priya Bapat",
      "Status": "Coming Soon"
    }
  },
  'mainactor': {
    title: "Main Actor Nahi Hu",
    category: "Meta-Cinema / Drama",
    poster: "images/main_actor.jpg",
    logline: "A reflective deconstruction of fame, artistic integrity, and the blurred boundaries between reel and real life.",
    synopsis: "Directed by acclaimed filmmaker Aditya Kripalani, Main Actor Nahi Hu stars Nawazuddin Siddiqui and Chitrangda Chakraborty. The film offers an intimate, piercing look at performance, ego, and vulnerability in Indian cinema.",
    meta: {
      "Director": "Aditya Kripalani",
      "Producers": "Side Hero Entertainment & Mumba Devi Films",
      "Starring": "Nawazuddin Siddiqui & Chitrangda Chakraborty",
      "Genre": "Independent Feature"
    }
  },
  'sonekichhadi': {
    title: "Sone Ki Chhadi (The Gold Stick)",
    category: "Social Impact Documentary",
    poster: "images/sone_ki_chhadi.jpg",
    logline: "The untold plight of sugarcane farmers in Western Uttar Pradesh, exploring how an agricultural heartland turned into an agrarian crisis.",
    synopsis: "Produced by Side Hero Entertainment and spearheaded by Faizuddin Siddiqui's NGO Lihaaz Foundation, Sone Ki Chhadi documents the reality of sugarcane farmers in Budhana, Muzaffarnagar. A decade ago, a 7-8 acre landowner was considered self-reliant and joyful, but today even 30-40 acre owners battle severe economic and systemic hardship. The documentary has become an urgent voice for agrarian reform.",
    meta: {
      "Director": "Faizuddin Siddiqui",
      "Producer": "Side Hero Entertainment Pvt. Ltd.",
      "Initiative": "Lihaaz Foundation",
      "Focus Area": "Sugarcane Farmers Advocacy, Agrarian Economics"
    }
  },
  'ishqbayan': {
    title: "Ishq Bayan Nahi Hota",
    category: "Original Music Video",
    poster: "images/ishq_bayan.png",
    logline: "A lyrical ode to silent yearning, poetic romance, and the profound depth of unexpressed devotion.",
    synopsis: "An evocative musical production blending lush orchestral arrangements with contemporary cinematic visuals, produced by Side Hero Entertainment.",
    meta: {
      "Producer": "Side Hero Entertainment",
      "Format": "4K Ultra HD Music Video",
      "Distribution": "Global Digital Streaming"
    }
  },
  'yanta': {
    title: "Yanta",
    category: "Music Single",
    poster: "images/yanta.jpg",
    logline: "A rhythmic, electrifying sonic and visual exploration fusing avant-garde beats with visual storytelling.",
    synopsis: "Yanta showcases Side Hero Entertainment's commitment to pushing stylistic boundaries across modern music composition and experimental music video directing.",
    meta: {
      "Producer": "Side Hero Entertainment",
      "Genre": "Contemporary / Electronic Indie"
    }
  }
};

const teamData = {
  'faizuddin': {
    name: "Faizuddin Siddiqui",
    role: "Producer & Writer",
    photo: "images/faizuddin.png",
    bio: "Coming from a rich journalism background and being the younger brother of veteran actor Nawazuddin Siddiqui, Faizuddin started his journey in the film industry as a writer with 'Arthi' and 'Adhura Khvaab'. These two stories were nurtured into full-length feature films, and Faiz decided to produce both under his banner, Side Hero Entertainment Pvt. Ltd.\n\nBoth debut films achieved critical acclaim and were officially screened at multiple prestigious film festivals across India and internationally. A visionary storyteller, Faiz dreams of making cinema intimately rooted in human relationships, empathy, and social values.\n\nHe is also passionately committed to social upliftment through his NGO, Lihaaz Foundation. Under these efforts, he has served as a fearless voice for sugarcane farmers in his hometown of Budhana, Muzaffarnagar, producing impactful documentaries like 'Sone Ki Chhadi' (The Gold Stick) to champion agrarian justice."
  },
  'saba': {
    name: "Saba Siddiqui",
    role: "Producer",
    photo: "images/saba_modal.jpg",
    bio: "Saba started her career as an educator in Dehradun, bringing over 10 years of leadership and deep pedagogical insight from the education industry. Deeply empathetic to pressing social causes, she has been actively working for community development and rural welfare for years.\n\nTo institutionalize these social upliftment efforts, she co-founded Lihaaz Foundation. As a producer at Side Hero Entertainment, Saba is committed to backing meaningful, responsible cinema that honors human values, family dynamics, and real social realities."
  },
  'shiv': {
    name: "Shiv Sharan Chowdhury",
    role: "Associate Producer",
    photo: "images/shiv_modal.png",
    bio: "Shiv brings approximately 25 years of seasoned expertise in the Indian media, broadcast television, and motion picture industries. Over two and a half decades, he has held vital roles across Star News, Star TV, INX Media, Sony Sports, and top-tier film production studios.\n\nAt Side Hero Entertainment, Shiv manages core line production, project execution, post-production workflows, channel distribution integration, and end-to-end studio operations."
  }
};

function initModals() {
  const modalOverlay = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalPoster = document.getElementById('modal-poster');
  const modalLogline = document.getElementById('modal-logline');
  const modalSynopsis = document.getElementById('modal-synopsis');
  const modalMetaTable = document.getElementById('modal-meta-table');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modalOverlay) return;

  function openProjectModal(key) {
    const data = projectData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalPoster.src = data.poster;
    modalPoster.alt = data.title;
    modalLogline.textContent = data.logline || '';
    modalSynopsis.textContent = data.synopsis || '';

    // Render meta rows
    modalMetaTable.innerHTML = '';
    if (data.meta) {
      for (const [k, v] of Object.entries(data.meta)) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${k}</td><td>${v}</td>`;
        modalMetaTable.appendChild(tr);
      }
    }

    modalOverlay.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  // Trigger from project cards & spotlight
  document.querySelectorAll('[data-project-key]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-project-key');
      openProjectModal(key);
    });
  });

  // Team Modal triggers
  document.querySelectorAll('[data-team-key]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const key = el.getAttribute('data-team-key');
      const team = teamData[key];
      if (!team) return;

      modalTitle.textContent = team.name;
      modalCategory.textContent = team.role;
      modalPoster.src = team.photo;
      modalPoster.alt = team.name;
      modalLogline.textContent = team.role;
      modalSynopsis.innerHTML = team.bio.replace(/\n\n/g, '<br><br>');
      modalMetaTable.innerHTML = `
        <tr><td>Organization</td><td>Side Hero Entertainment Pvt. Ltd.</td></tr>
        <tr><td>Initiative</td><td>Lihaaz Foundation</td></tr>
        <tr><td>Location</td><td>Mumbai / Uttar Pradesh</td></tr>
      `;

      modalOverlay.classList.add('open');
      document.body.classList.add('no-scroll');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Contact Form Handling
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const textarea = document.getElementById('form-message');
  const charCount = document.getElementById('char-count');
  const fileInput = document.getElementById('file-upload');
  const fileLabel = document.getElementById('file-upload-label');
  const submitBtn = document.getElementById('form-submit-btn');

  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = `${textarea.value.length} / 1000 symbols`;
    });
  }

  if (fileInput && fileLabel) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileLabel.textContent = `Attached: ${fileInput.files[0].name}`;
      } else {
        fileLabel.textContent = 'Attach Project Brief / Script (Optional)';
      }
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="red-dot"></span> Sending Message...
      `;

      // Realistic response simulation
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();
        if (charCount) charCount.textContent = '0 / 1000 symbols';
        if (fileLabel) fileLabel.textContent = 'Attach Project Brief / Script (Optional)';

        alert('Thank you! Your submission has been received by Side Hero Entertainment. Our production team will contact you shortly.');
      }, 1200);
    });
  }
}

/* ==========================================================================
   7. Active Nav Link on Scroll
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
