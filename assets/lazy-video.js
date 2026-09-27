(function () {
  var saveData = navigator.connection && navigator.connection.saveData;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else if (!v.paused) v.pause();
    });
  }, { rootMargin: '150px 0px' }) : null;

  function watch(v) {
    if (v.__pmLazy || saveData) return;
    v.__pmLazy = true;
    v.muted = true;
    if (io) io.observe(v); else v.play();
  }
  window.pmLazyVideo = watch;

  function scan() { document.querySelectorAll('video[data-lazy]').forEach(watch); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();
