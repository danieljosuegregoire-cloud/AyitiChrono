// js/header.js
document.addEventListener("DOMContentLoaded", function() {

  // Chemins relatifs (header.html et footer.html doivent être à la racine ou même dossier)
  const headerContainer = document.getElementById("header-container");
  const footerContainer = document.getElementById("footer-container");

  function afterInjectInit() {
    // --- sélection des éléments du header (après injection) ---
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    // mobile submenu buttons (dans header.html on a .mobile-dropdown et .mobile-dropbtn)
    const mobileDropButtons = document.querySelectorAll(".mobile-dropbtn");

    // Ouvre/ferme mobile menu
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", function(e){
        e.stopPropagation();
        mobileMenu.classList.toggle("active");
        mobileMenu.setAttribute("aria-hidden", !mobileMenu.classList.contains("active"));
      });

      // fermer si on clique ailleurs
      document.addEventListener("click", function(){
        if (mobileMenu.classList.contains("active")) {
          mobileMenu.classList.remove("active");
          mobileMenu.setAttribute("aria-hidden","true");
        }
      });

      // echap ferme
      document.addEventListener("keydown", function(e){
        if (e.key === "Escape") {
          mobileMenu.classList.remove("active");
          mobileMenu.setAttribute("aria-hidden","true");
        }
      });
    }

    // Empêche la fermeture si on clique à l'intérieur du menu (utile)
    if (mobileMenu) {
      mobileMenu.addEventListener("click", function(e){ e.stopPropagation(); });
    }

    // Mobile submenu toggle (pour chaque bloc .mobile-dropdown)
    mobileDropButtons.forEach(btn => {
      btn.addEventListener("click", function(e){
        const wrapper = btn.closest(".mobile-dropdown");
        if (!wrapper) return;
        wrapper.classList.toggle("active"); // CSS .mobile-dropdown.active .mobile-dropdown-content { display:block }
      });
    });

    // Desktop: pour sécurité, fermer dropdowns au clic dehors
    document.addEventListener("click", function(e){
      // si on clique en dehors d'un dropdown ouvert, on ferme tous
      document.querySelectorAll(".dropdown-content").forEach(dc => {
        const parent = dc.closest(".dropdown");
        if (parent && !parent.contains(e.target)) {
          dc.style.display = ""; // reset (hover gère l'ouverture)
        }
      });
    });
  }

  // Injecte header puis footer, puis initialise
  function inject(filePath, container, cb) {
    if (!container) { cb && cb(); return; }
    fetch(filePath)
      .then(r => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(html => {
        container.innerHTML = html;
        cb && cb();
      })
      .catch(err => {
        console.error("Erreur chargement", filePath, err);
        cb && cb();
      });
  }

  // Utiliser chemins relatifs (header.html et footer.html au même niveau que la page)
  inject("header.html", headerContainer, function(){
    // Une fois header injecté, injecter footer puis init
    inject("footer.html", footerContainer, afterInjectInit);
  });

});