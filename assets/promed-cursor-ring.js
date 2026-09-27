(function () {
  'use strict';

  function setupPageTransitions() {
    if (document.getElementById('promedPageTransition')) return;
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', setupPageTransitions, { once: true });
      return;
    }
    var style = document.createElement('style');
    style.textContent = 'html.promed-transition-ready{background:#031428}body.promed-page-enter{opacity:0;transform:translateY(10px)}body.promed-page-live{opacity:1;transform:translateY(0);transition:opacity .42s ease,transform .52s cubic-bezier(.22,1,.36,1)}#promedPageTransition{position:fixed;inset:0;z-index:20000;background:#031428;pointer-events:none;transform:translateY(0);opacity:1}#promedPageTransition.is-ready{opacity:0;transform:translateY(-100%);transition:opacity .24s ease,transform .5s cubic-bezier(.76,0,.24,1)}#promedPageTransition.is-leaving{opacity:1;transform:translateY(0);transition:opacity .18s ease,transform .36s cubic-bezier(.76,0,.24,1)}.hero,.about-hero,.site-hero,.page-header{box-sizing:border-box!important;height:auto!important;min-height:620px!important;max-height:none!important;overflow:hidden}.hero video,.hero-video,.about-hero video,.site-hero video{width:100%;height:100%;object-fit:cover}.hero-content,.about-hero .hero-content,.site-hero>div:not(canvas){animation:promedHeroSlide .8s cubic-bezier(.22,1,.36,1) both}.hero-content h1,.about-hero h1{font-size:clamp(2.5rem,5vw,4rem);line-height:1.08;letter-spacing:-.035em}.hero-sub,.hero-subtitle,.hero-desc,.hero-subdesc,.about-hero .hero-desc{font-size:1.05rem;line-height:1.7;max-width:720px}.hero-label,.hero-eyebrow{margin-bottom:18px}@keyframes promedHeroSlide{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}@media(max-width:700px){.hero,.about-hero,.site-hero,.page-header{box-sizing:border-box!important;height:auto!important;min-height:520px!important;max-height:none!important}.hero-content,.about-hero .hero-content,.site-hero>div:not(canvas){padding-left:24px!important;padding-right:24px!important}.hero-content h1,.about-hero h1{font-size:clamp(2rem,9vw,3rem)}.hero-sub,.hero-subtitle,.hero-desc,.hero-subdesc,.about-hero .hero-desc{font-size:.95rem}}@media(prefers-reduced-motion:reduce){body.promed-page-enter,body.promed-page-live{opacity:1;transform:none;transition:none}#promedPageTransition{display:none}.hero-content,.about-hero .hero-content,.site-hero>div:not(canvas){animation:none!important}}';
    document.head.appendChild(style);
    document.documentElement.classList.add('promed-transition-ready');
  }

  function setupHamburgerMenu() {
    var nav = document.querySelector('nav, .navbar');
    if (!nav) return;
    var navLinks = nav.querySelector('.nav-links');
    var container = nav.querySelector('.nav-inner, .nav-container') || nav;
    if (!container || !navLinks) return;

    if (!container.querySelector('.promed-hamburger')) {
      var btn = document.createElement('button');
      btn.className = 'promed-hamburger';
      btn.setAttribute('aria-label', 'Toggle Navigation');
      btn.innerHTML = '<span></span><span></span><span></span>';

      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        btn.classList.toggle('is-active');
        navLinks.classList.toggle('mobile-open');
      });

      container.appendChild(btn);
    }

    document.addEventListener('click', function (e) {
      var btn = container.querySelector('.promed-hamburger');
      if (btn && btn.classList.contains('is-active') && !nav.contains(e.target)) {
        btn.classList.remove('is-active');
        navLinks.classList.remove('mobile-open');
      }
    });

    var links = navLinks.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        var btn = container.querySelector('.promed-hamburger');
        if (btn) {
          btn.classList.remove('is-active');
          navLinks.classList.remove('mobile-open');
        }
      });
    }
  }

  function setupVideoObserver() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;
        if (entry.isIntersecting) {
          if (video.paused && video.hasAttribute('autoplay')) {
            video.play().catch(function () {});
          }
        } else {
          if (!video.paused) {
            video.pause();
          }
        }
      });
    }, { threshold: 0.1 });

    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      observer.observe(videos[i]);
    }
  }

  function start(canvasId) {
    if (!document.body) {
      document.addEventListener('DOMContentLoaded', function () { start(canvasId); }, { once: true });
      return;
    }
    setupPageTransitions();
    setupHamburgerMenu();
    setupVideoObserver();
    return;
    var canvas = document.getElementById(canvasId);
    if (!canvas && !canvasId) {
      canvas = document.createElement('canvas');
      canvas.id = 'promedGlobalCursorField';
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:9998;pointer-events:none;';
      document.body.appendChild(canvas);
    }
    if (!canvas || canvas.__promedCursorRing) return;
    canvas.style.display = 'none';
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.__promedCursorRing = true;

    var host = canvas.parentElement;
    var particles = [];
    var pointer = { x: 0, y: 0, active: false };
    var ring = { x: 0, y: 0, energy: 0 };
    var width = 1;
    var height = 1;
    var dpr = 1;
    var frame = 0;
    var last = 0;
    var cursor = null;
    var cursorCore = null;
    var cursorLabel = null;
    var cursorX = -80;
    var cursorY = -80;
    var cursorTargetX = -80;
    var cursorTargetY = -80;
    var followEase = 0.05;
    var ringEase = 0.03;

    function setupCursor() {
      if (document.getElementById('promedCursor')) return;
      var style = document.createElement('style');
      style.textContent = '#promedCursor{position:fixed;left:0;top:0;z-index:10000;display:flex;align-items:flex-start;gap:5px;pointer-events:none;opacity:0;will-change:transform;transition:opacity .15s ease}#promedCursor-shape{display:block;width:15px;height:19px;background:#090909;clip-path:polygon(0 0,100% 77%,57% 61%,42% 100%);filter:drop-shadow(0 1px 2px rgba(255,255,255,.45))}#promedCursor-label{display:block;margin:7px 0 0 1px;padding:4px 9px 5px;border-radius:999px;background:#090909;color:#fff;font:600 11px/1.1 Arial,sans-serif;white-space:nowrap;box-shadow:0 2px 7px rgba(0,0,0,.3)}body.promed-cursor-ready,body.promed-cursor-ready *{cursor:none!important}@media (hover:none){#promedCursor{display:none!important}body.promed-cursor-ready,body.promed-cursor-ready *{cursor:auto!important}}';
      document.head.appendChild(style);
      cursor = document.createElement('div');
      cursor.id = 'promedCursor';
      cursor.innerHTML = '<span id="promedCursor-shape"></span><span id="promedCursor-label">ProMED</span>';
      document.body.appendChild(cursor);
      cursorCore = document.getElementById('promedCursor-core');
      cursorLabel = document.getElementById('promedCursor-label');
      document.body.classList.add('promed-cursor-ready');
    }

    function updateCursor(event) {
      if (!cursor) return;
      cursorTargetX = event.clientX;
      cursorTargetY = event.clientY;
      cursor.style.opacity = '1';
    }

    function touchPulse(event) {
      if (!event.isPrimary || !window.matchMedia('(hover: none)').matches) return;
      var pulse = document.createElement('span');
      pulse.style.cssText = 'position:fixed;left:' + event.clientX + 'px;top:' + event.clientY + 'px;width:18px;height:18px;margin:-9px;border:1px solid #00e5ff;border-radius:50%;pointer-events:none;z-index:9999;animation:promedTouchPulse .7s ease-out forwards;';
      document.body.appendChild(pulse);
      setTimeout(function () { pulse.remove(); }, 720);
    }

    function resize() {
      var box = host.getBoundingClientRect();
      width = Math.max(1, box.width);
      height = Math.max(1, box.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = [];
      var count = Math.min(260, Math.max(110, Math.round(width * height / 5200)));
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          size: Math.random() * 1.6 + 0.45,
          alpha: Math.random() * 0.42 + 0.16
        });
      }
    }

    function move(event) {
      var box = canvas.getBoundingClientRect();
      pointer.x = event.clientX - box.left;
      pointer.y = event.clientY - box.top;
      pointer.active = true;
    }

    function leave() {
      pointer.active = false;
    }

    function draw(now) {
      frame = requestAnimationFrame(draw);
      var dt = Math.min(32, last ? now - last : 16) / 16;
      last = now;
      if (cursor) {
        cursorX += (cursorTargetX - cursorX) * Math.min(followEase * dt, 0.7);
        cursorY += (cursorTargetY - cursorY) * Math.min(followEase * dt, 0.7);
        cursor.style.transform = 'translate3d(' + (cursorX - 2) + 'px,' + (cursorY - 2) + 'px,0)';
      }
      var idleX = width * 0.5 + Math.sin(now * 0.00012) * width * 0.08;
      var idleY = height * 0.48 + Math.cos(now * 0.0001) * height * 0.06;
      var targetX = pointer.active ? pointer.x : idleX;
      var targetY = pointer.active ? pointer.y : idleY;
      ring.x += (targetX - ring.x) * (ringEase * dt);
      ring.y += (targetY - ring.y) * (ringEase * dt);
      ring.energy += ((pointer.active ? 1 : 0.35) - ring.energy) * (0.025 * dt);

      ctx.clearRect(0, 0, width, height);
      particles.forEach(function (particle) {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        if (particle.x < -10) particle.x = width + 10;
        if (particle.x > width + 10) particle.x = -10;
        if (particle.y < -10) particle.y = height + 10;
        if (particle.y > height + 10) particle.y = -10;
        var dx = ring.x - particle.x;
        var dy = ring.y - particle.y;
        var distance = Math.sqrt(dx * dx + dy * dy) || 1;
        if (distance < 210) {
          var pull = (1 - distance / 210) * 0.018 * dt;
          particle.x -= dx * pull;
          particle.y -= dy * pull;
        }
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(155, 204, 246, ' + particle.alpha + ')';
        ctx.fill();
      });

      var radius = 70 + Math.sin(now * 0.0028) * 5;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 229, 255, ' + (0.2 + ring.energy * 0.16) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius + 31 + Math.cos(now * 0.002) * 5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(48, 116, 249, ' + (0.1 + ring.energy * 0.1) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
      var glow = ctx.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, 160);
      glow.addColorStop(0, 'rgba(0, 229, 255, ' + (0.16 * ring.energy) + ')');
      glow.addColorStop(1, 'rgba(0, 229, 255, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(ring.x - 160, ring.y - 160, 320, 320);
    }

    setupCursor();
    resize();
    ring.x = width * 0.5;
    ring.y = height * 0.5;
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointermove', updateCursor, { passive: true });
    window.addEventListener('pointerdown', touchPulse, { passive: true });
    canvas.addEventListener('pointerleave', leave);
    frame = requestAnimationFrame(draw);
    window.addEventListener('beforeunload', function () {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointermove', updateCursor);
      window.removeEventListener('pointerdown', touchPulse);
    });
  }

  window.initProMEDCursorRing = start;
})();
