// webMMS — petites interactions, sans dépendance
(function () {
  'use strict';

  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Année du pied de page
  var annee = document.querySelector('[data-annee]');
  if (annee) annee.textContent = new Date().getFullYear();

  // Entête : trait sous la barre une fois qu'on a défilé
  var entete = document.querySelector('[data-entete]');
  function majEntete() {
    if (entete) entete.classList.toggle('defile', window.scrollY > 8);
  }
  majEntete();
  window.addEventListener('scroll', majEntete, { passive: true });

  // Menu sur cellulaire
  var bouton = document.querySelector('[data-menu-bouton]');
  var menu = document.querySelector('[data-menu]');
  function fermerMenu() {
    if (!bouton || !menu) return;
    bouton.setAttribute('aria-expanded', 'false');
    bouton.querySelector('.sr-only').textContent = 'Ouvrir le menu';
    menu.classList.remove('ouvert');
  }
  if (bouton && menu) {
    bouton.addEventListener('click', function () {
      var ouvert = bouton.getAttribute('aria-expanded') === 'true';
      bouton.setAttribute('aria-expanded', String(!ouvert));
      bouton.querySelector('.sr-only').textContent = ouvert ? 'Ouvrir le menu' : 'Fermer le menu';
      menu.classList.toggle('ouvert', !ouvert);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fermerMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') fermerMenu();
    });
  }

  // Apparition des sections au défilement
  var aMontrer = document.querySelectorAll('.apparait');
  if (reduit || !('IntersectionObserver' in window)) {
    aMontrer.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (entree) {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          obs.unobserve(entree.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    aMontrer.forEach(function (el) { obs.observe(el); });
  }

  // « Pour les … » : les métiers s'écrivent et s'effacent tour à tour
  var rot = document.querySelector('[data-rotateur]');
  if (rot && !reduit) {
    var mots = rot.getAttribute('data-mots').split('|');
    var i = 0, pos = 0, efface = false;
    rot.textContent = '';
    (function tick() {
      var mot = mots[i];
      if (!efface) {
        pos++;
        rot.textContent = mot.slice(0, pos);
        if (pos === mot.length) { efface = true; return setTimeout(tick, 1600); }
        return setTimeout(tick, 70);
      }
      pos--;
      rot.textContent = mot.slice(0, pos);
      if (pos === 0) { efface = false; i = (i + 1) % mots.length; return setTimeout(tick, 250); }
      setTimeout(tick, 35);
    })();
  }
})();
