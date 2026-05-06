(function () {
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('[data-animate], .quote-break').forEach(el => animObserver.observe(el));

  function initShootingStars(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], animId, isVisible = false;
    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    function spawn() {
      if (Math.random() > 0.03) return;
      stars.push({ x: Math.random() * w, y: Math.random() * h * 0.5, len: 120 + Math.random() * 200, angle: Math.PI / 5 + Math.random() * 0.3, alpha: 1, speed: 12 + Math.random() * 10, progress: 0 });
    }
    function draw() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);
      spawn();
      stars = stars.filter(s => s.alpha > 0.01);
      stars.forEach(s => {
        s.progress += s.speed; s.alpha -= 0.012;
        const sx = s.x + Math.cos(s.angle) * s.progress, sy = s.y + Math.sin(s.angle) * s.progress;
        const ex = sx - Math.cos(s.angle) * s.len, ey = sy - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(ex, ey, sx, sy);
        grad.addColorStop(0, 'rgba(255,255,255,0)'); grad.addColorStop(1, `rgba(255,255,255,${s.alpha})`);
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(sx, sy); ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.globalCompositeOperation = 'lighter'; ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
      });
      animId = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) draw(); else cancelAnimationFrame(animId);
    }, { threshold: 0.01 });
    observer.observe(canvas);
    resize(); window.addEventListener('resize', resize);
  }

  function initSpaceFlight(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [], animId, isVisible = false;
    const COUNT = 400, SPEED = 6;
    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = Math.max(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);
      initStars();
    }
    function initStars() {
      stars = Array.from({ length: COUNT }, () => ({ x: (Math.random() - 0.5) * 2000, y: (Math.random() - 0.5) * 2000, z: Math.random() * 2000, pz: 0 }));
      stars.forEach(s => s.pz = s.z);
    }
    function draw() {
      if (!isVisible) return;
      ctx.fillStyle = '#050510'; ctx.fillRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      for (let i = 0; i < COUNT; i++) {
        const s = stars[i]; s.z -= SPEED;
        if (s.z <= 0) { s.z = 2000; s.pz = 2000; }
        const x = (s.x / s.z) * w + cx, y = (s.y / s.z) * h + cy;
        if (x < 0 || x > w || y < 0 || y > h) { s.z = 2000; s.pz = 2000; }
        else {
          const px = (s.x / s.pz) * w + cx, py = (s.y / s.pz) * h + cy;
          s.pz = s.z;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, (1 - s.z / 2000) * 1.5)})`;
          ctx.lineWidth = (1 - s.z / 2000) * 2.5; ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) draw(); else cancelAnimationFrame(animId);
    }, { threshold: 0.01 });
    observer.observe(canvas);
    resize(); window.addEventListener('resize', resize);
  }

  function initTwinklingStars(canvasId, density = 200, speedMult = 1) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [], w, h, animId, isVisible = false;
    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
      stars = Array.from({ length: density }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.3, speed: (Math.random() * 0.005 + 0.002) * speedMult, phase: Math.random() * Math.PI * 2 }));
    }
    function draw(t) {
      if (!isVisible) return;
      ctx.clearRect(0, 0, w, h);
      stars.forEach(s => {
        const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    }
    const observer = new IntersectionObserver(entries => {
      isVisible = entries[0].isIntersecting;
      if (isVisible) draw(); else cancelAnimationFrame(animId);
    }, { threshold: 0.01 });
    observer.observe(canvas);
    resize(); window.addEventListener('resize', resize);
  }

  const timeline = document.getElementById('timeline');
  const progressLine = document.getElementById('timeline-progress');
  const markers = Array.from(document.querySelectorAll('.timeline-marker'));

  markers.forEach(marker => {
    marker.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
    });
  });

  function updateTimeline() {
    const scrollY = window.scrollY;
    const heroH = document.getElementById('section-hero')?.offsetHeight || 0;
    timeline?.classList.toggle('visible', scrollY > heroH * 0.5);

    const viewportCenter = window.innerHeight * 0.5;
    let activeMarker = null;
    let activeIndex = -1;
    let sectionProgress = 0;
    
    for (let i = markers.length - 1; i >= 0; i--) {
      const id = markers[i].getAttribute('href').substring(1);
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= viewportCenter + 50) {
          activeMarker = markers[i];
          activeIndex = i;
          const scrolledPastCenter = viewportCenter - rect.top;
          sectionProgress = Math.max(0, Math.min(1, scrolledPastCenter / rect.height));
          break;
        }
      }
    }

    if (Math.ceil(scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 10) {
      activeIndex = markers.length - 1;
      activeMarker = markers[activeIndex];
      sectionProgress = 1;
    }

    markers.forEach(m => m.classList.remove('active'));
    if (activeMarker) activeMarker.classList.add('active');

    if (activeMarker && progressLine) {
      const markerTop = activeMarker.offsetTop + (activeMarker.offsetHeight / 2);
      let nextMarkerTop = markerTop;
      
      if (activeIndex < markers.length - 1) {
        const nextMarker = markers[activeIndex + 1];
        nextMarkerTop = nextMarker.offsetTop + (nextMarker.offsetHeight / 2);
      }
      
      const linePx = markerTop + (nextMarkerTop - markerTop) * sectionProgress;
      progressLine.style.height = `${linePx}px`;
    } else if (progressLine) {
      progressLine.style.height = '0px';
    }
  }

  const infoData = {
    "V-2 Rocket": { desc: "The V-2 was the world's first long-range guided ballistic missile. Developed in Peenemünde under Wernher von Braun, it became the first man-made object to cross the Kármán line (100km) in 1944. After the war, captured V-2s formed the basis for both US and Soviet space programs.", img: "img/a4.jpg" },
    "Dezik & Tsygan": { desc: "Dezik and Tsygan were the first higher mammals to survive a suborbital flight on July 22, 1951. They reached 101km altitude and experienced 4 minutes of weightlessness. Their safe recovery proved that biological organisms could withstand the stresses of rocket flight.", img: "img/Dezik-Tsygan.jpg" },
    "Sergei Korolev": { desc: "The 'Chief Designer' was a state secret until his death. He survived the Kolyma Gulag camps during the Great Purge, an experience that permanently damaged his health. He later led the creation of the R-7 rocket, the first ICBM and the launcher for Sputnik and Gagarin.", img: "img/korolev1.jpg" },
    "Laika": { desc: "Laika was a stray dog from Moscow. Her mission proved that a living passenger could survive being launched into orbit and endure weightlessness. Although she did not survive the return (the craft lacked a recovery system), she provided critical data for human spaceflight.", img: "img/laika.jpg" },
    "Belka & Strelka": { desc: "Belka and Strelka were the first living creatures to spend a day in orbit and return safely. Along with 42 mice and 2 rats, they paved the way for the first manned mission. Strelka later had puppies, one of which was gifted to the US First Family.", img: "img/Belka-Strelka.jpg" },
    "Vostok Cabin": { desc: "The Vostok cabin was a 2.3-meter pressurized sphere. Because of its shape, it had no aerodynamic control during re-entry. The pilot had to eject at 7km altitude and land via personal parachute, a detail the Soviets kept secret for years to satisfy FAI records.", img: "img/vostok-cabin.jpg" },
    "Yuri Gagarin": { desc: "Gagarin was chosen for his small stature (1.57m), calm demeanor, and working-class background. During the mission, a cable bundle failed to detach during re-entry, causing the craft to spin at 30 degrees per second before finally burning through and stabilizing.", img: "img/gagarin.jpg" },
    "Valentina Tereshkova": { desc: "In 1963, Tereshkova became the first woman in space aboard Vostok 6. She spent almost three days in space, orbiting the Earth 48 times. Her flight was a powerful symbol of gender equality in the Soviet space program.", img: "img/tereshkova.jpg" },
    "Alexei Leonov": { desc: "In 1965, Leonov performed the first ever spacewalk (EVA) from the Voskhod 2 craft. His space suit ballooned in the vacuum, forcing him to manually vent oxygen to squeeze back into the airlock — a life-threatening maneuver.", img: "img/leonov.jpg" },
    "Explorer 1": { desc: "The first US satellite, launched in 1958. It carried instruments that discovered the Van Allen radiation belts — intense zones of radiation trapped by Earth's magnetic field — marking the first major scientific discovery of the Space Age.", img: "img/explorer1.webp" },
    "John Glenn": { desc: "In 1962, John Glenn became the first American to orbit the Earth aboard the Friendship 7 capsule. His mission restored national pride after the Soviet leads and proved the reliability of the Mercury-Atlas launch vehicle.", img: "img/john-lenn.jpg" },
    "Gemini": { desc: "The bridge between Mercury and Apollo. This two-man program mastered orbital maneuvers, long-duration flight, and docking — essential techniques for reaching the Moon. It also featured the first American spacewalk by Ed White.", img: "img/gemini.webp" },
    "Apollo 8": { desc: "The first human mission to leave Earth's orbit and reach the Moon. On Christmas Eve 1968, the crew captured the 'Earthrise' photo, which revolutionized how humanity perceived our home planet as a fragile, unified whole.", img: "img/apollo8.jpg" }
  };

  function initInteractions() {
    const lightbox = document.getElementById('lightbox'), lbImg = document.getElementById('lightbox-img');
    const curIdx = document.getElementById('current-idx'), totalIdx = document.getElementById('total-idx');
    let currentGallery = [], activeIdx = 0;

    const updateLB = () => {
      lbImg.classList.add('fade');
      setTimeout(() => {
        lbImg.src = currentGallery[activeIdx].src;
        if (curIdx) curIdx.textContent = activeIdx + 1;
        if (totalIdx) totalIdx.textContent = currentGallery.length;
        lbImg.classList.remove('fade');
      }, 150);
    };

    document.querySelectorAll('.zoomable').forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const parent = img.closest('section') || img.closest('.imagined-gallery') || document.body;
        currentGallery = Array.from(parent.querySelectorAll('.zoomable'));
        activeIdx = currentGallery.indexOf(img);
        updateLB();
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');
      });
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.classList.remove('lightbox-open');
    });

    document.querySelector('.lightbox-next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIdx = (activeIdx + 1) % currentGallery.length;
      updateLB();
    });

    document.querySelector('.lightbox-prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      activeIdx = (activeIdx - 1 + currentGallery.length) % currentGallery.length;
      updateLB();
    });

    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');
      }
    });

    document.querySelectorAll('.music-card').forEach(card => {
      const audioUrl = card.getAttribute('data-audio');
      if (!audioUrl) return;
      const audio = new Audio(audioUrl);
      audio.loop = true;
      card.addEventListener('mouseenter', () => {
        audio.play().catch(() => { });
        card.classList.add('playing');
      });
      card.addEventListener('mouseleave', () => {
        audio.pause();
        card.classList.remove('playing');
      });
    });

    const infoMdl = document.getElementById('info-modal'), infoTitle = document.getElementById('modal-title'), infoDesc = document.getElementById('modal-desc'), infoImg = document.getElementById('modal-img');
    document.querySelectorAll('.info-link').forEach(link => link.addEventListener('click', () => {
      const d = infoData[link.innerText.trim()];
      if (d) {
        infoTitle.textContent = link.innerText.trim();
        infoDesc.textContent = d.desc;
        if (d.img) { infoImg.src = d.img; infoImg.style.display = 'block'; } else { infoImg.style.display = 'none'; }
        infoMdl.style.display = 'flex'; infoMdl.classList.add('active'); document.body.classList.add('lightbox-open');
      }
    }));
    infoMdl?.querySelector('.modal-close')?.addEventListener('click', () => { infoMdl.style.display = 'none'; infoMdl.classList.remove('active'); document.body.classList.remove('lightbox-open'); });

    const vidMdl = document.getElementById('video-modal'), vid = document.getElementById('modal-video');
    document.querySelectorAll('.video-trigger').forEach(trig => trig.addEventListener('click', () => {
      const src = trig.getAttribute('data-video');
      if (src) { vid.src = src; vidMdl.style.display = 'flex'; vidMdl.classList.add('active'); document.body.classList.add('lightbox-open'); vid.play(); }
    }));
    const closeVid = () => { vid.pause(); vid.src = ""; vidMdl.style.display = 'none'; vidMdl.classList.remove('active'); document.body.classList.remove('lightbox-open'); };
    vidMdl?.querySelector('.modal-close')?.addEventListener('click', closeVid);

    const scrollTop = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => scrollTop?.classList.toggle('visible', window.scrollY > 500), { passive: true });
    scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    initSpaceFlight('starfield'); initShootingStars('shooting-stars');
    initTwinklingStars('starfield-footer', 150, 0.4); initTwinklingStars('starfield-awakening', 150);
    initInteractions(); window.addEventListener('scroll', updateTimeline, { passive: true }); updateTimeline();
    const counterObs = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = 'true'; const t = parseInt(e.target.dataset.count), d = 2000, s = performance.now();
        const tk = (n) => { const elp = n - s, prg = Math.min(elp / d, 1), es = 1 - Math.pow(1 - prg, 3); e.target.textContent = Math.round(es * t).toLocaleString(); if (prg < 1) requestAnimationFrame(tk); };
        requestAnimationFrame(tk);
      }
    }), { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObs.observe(el));
    const wf = document.getElementById('waveform');
    if (wf) for (let i = 0; i < 40; i++) { const b = document.createElement('div'); b.className = 'bar'; b.style.animationDelay = `${Math.random() * 1.2}s`; b.style.animationDuration = `${0.8 + Math.random() * 0.8}s`; wf.appendChild(b); }
  });
})();
