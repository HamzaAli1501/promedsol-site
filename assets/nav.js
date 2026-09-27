(function () {
  var script = document.currentScript;
  var MENU = [
    { label: 'Home', href: 'index.html', pages: ['index.html', ''] },
    {
      label: 'About ProMED', href: 'about-us.html', pages: ['about-us.html'],
      items: [
        ['about-us.html#who', 'Our Story', 'Our identity & journey'],
        ['about-us.html#mission', 'Mission & Vision', 'Purpose & direction'],
        ['about-us.html#values', 'Core Values', 'Our principles'],
        ['about-us.html#leadership', 'Leadership Team', 'Our leaders'],
        ['about-us.html#milestones', 'Milestones', 'Our journey 2019-2026']
      ]
    },
    {
      label: 'ProMED Clinical Expertise Department', href: 'promed-command-center.html',
      pages: ['promed-command-center.html', 'central-operations-sales.html', 'central-operations-services.html', 'operations-partnership.html', 'operations-sales.html', 'operations-service.html'],
      items: [
        ['central-operations-sales.html', 'Sales Division', 'Equipment & solutions'],
        ['central-operations-services.html', 'Services Division', 'Maintenance & support'],
        ['operations-partnership.html', 'Equipment Rental & Partnership', 'Flexible solutions']
      ]
    },
    { label: 'Team Members', href: 'team-expertise.html', pages: ['team-expertise.html'] },
    { label: 'Contact', href: 'contact-support.html', pages: ['contact-support.html'] }
  ];

  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  var current = location.pathname.split('/').pop().toLowerCase();
  var top = '<div class="pm-topbar-in"><div class="pm-tb-left"><span>&#128231; <a href="mailto:info@promedsol.com.pk">info@promedsol.com.pk</a></span><span>&#128222; <a href="tel:+92516112202">+92 51 6112202</a></span><span class="pm-tb-web">&#127760; <a href="https://www.promedsol.com.pk" target="_blank" rel="noopener">www.promedsol.com.pk</a></span></div><span class="pm-tb-cert">ISO 9001:2015 &nbsp;&middot;&nbsp; PNRA Certified &nbsp;&middot;&nbsp; OEM Authorized</span></div>';
  var html = '<div class="pm-bar">' +
    '<a href="index.html" class="pm-logo" aria-label="ProMED Solutions home">' +
    '<img src="assets/images/promed-logo-light.webp" alt="ProMED Solutions" width="54" height="54">' +
    '<div class="pm-brand"><div class="pm-brand-name">ProMED Solutions</div><div class="pm-brand-tag">Redefining Healthcare</div></div></a>' +
    '<button class="pm-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>' +
    '<ul class="pm-links">';

  MENU.forEach(function (m) {
    var active = m.pages.indexOf(current) !== -1;
    html += '<li class="pm-item"><a class="pm-link' + (active ? ' active' : '') + '" href="' + m.href + '">' + esc(m.label) + '</a>';
    if (m.items) {
      html += '<button class="pm-caret" type="button" aria-label="Open ' + esc(m.label) + ' submenu">&#9662;</button><div class="pm-drop">';
      m.items.forEach(function (i) {
        html += '<a href="' + i[0] + '"><span class="pm-drop-title">' + esc(i[1]) + '</span><span class="pm-drop-desc">' + esc(i[2]) + '</span></a>';
      });
      html += '</div>';
    }
    html += '</li>';
  });
  html += '<li class="pm-item"><a class="pm-mobile-cta" href="contact-support.html">Get Support</a></li></ul>' +
    '<a href="contact-support.html" class="pm-cta">Get Support</a></div>';

  var topbar = document.createElement('div');
  topbar.className = 'pm-topbar';
  topbar.innerHTML = top;
  script.parentNode.insertBefore(topbar, script);

  var header = document.createElement('div');
  header.className = 'pm-header';
  header.setAttribute('role', 'navigation');
  header.setAttribute('aria-label', 'Main');
  header.innerHTML = html;
  script.parentNode.insertBefore(header, script);

  var toggle = header.querySelector('.pm-toggle');
  var links = header.querySelector('.pm-links');
  toggle.addEventListener('click', function () {
    var on = links.classList.toggle('open');
    toggle.classList.toggle('on', on);
    toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
  header.querySelectorAll('.pm-caret').forEach(function (btn) {
    btn.addEventListener('click', function () { btn.parentNode.classList.toggle('open'); });
  });
})();
