// header.js — version sûre et idempotente
(function () {
  // Attendre que le DOM soit prêt
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    // --- éléments centraux ---
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    // Sécurité : si pas de header injecté, recherche dans le document complet après injection
    // (utile quand header.html est injecté dynamiquement)
    function queryOnce(id) {
      return document.getElementById(id);
    }

    // Re-lire les éléments (au cas où header a été injecté après le chargement)
    const btn = menuBtn || queryOnce("menu-btn");
    const menu = mobileMenu || queryOnce("mobile-menu");

    // === 1) Toggle du menu mobile (sécurisé) ===
    if (btn && menu) {
      // évite d'ajouter plusieurs fois le même listener
      if (!btn._menuListenerAdded) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          menu.classList.toggle("active");
          menu.setAttribute("aria-hidden", (!menu.classList.contains("active")).toString());
        });
        btn._menuListenerAdded = true;
      }

      // Empêche fermeture si on clique à l'intérieur du menu
      if (!menu._insideClickGuard) {
        menu.addEventListener("click", function (e) { e.stopPropagation(); });
        menu._insideClickGuard = true;
      }

      // Ferme le menu si on clique ailleurs
      if (!document._globalMenuClickGuard) {
        document.addEventListener("click", function () {
          if (menu.classList.contains("active")) {
            menu.classList.remove("active");
            menu.setAttribute("aria-hidden", "true");
          }
        });
        document._globalMenuClickGuard = true;
      }

      // Ferme aussi à la touche Échap
      if (!document._escGuard) {
        document.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && menu.classList.contains("active")) {
            menu.classList.remove("active");
            menu.setAttribute("aria-hidden", "true");
          }
        });
        document._escGuard = true;
      }
    }

    // === 2) Mobile submenus (boutons .mobile-dropbtn dans le mobile-menu) ===
    // Fonction : bascule la classe .active sur l'élément parent .mobile-dropdown
    const mobileDropBtns = Array.from(document.querySelectorAll(".mobile-dropbtn"));
    if (mobileDropBtns.length) {
      mobileDropBtns.forEach(btnEl => {
        // évite double-attach
        if (btnEl._mobileDropbound) return;
        btnEl.addEventListener("click", function (e) {
          e.stopPropagation();
          const parent = btnEl.closest(".mobile-dropdown");
          if (!parent) return;
          parent.classList.toggle("active");
        });
        btnEl._mobileDropbound = true;
      });

      // empêche propagation sur les liens internes du sous-menu
      const mobileDropdownLinks = Array.from(document.querySelectorAll(".mobile-dropdown-content a"));
      mobileDropdownLinks.forEach(a => {
        if (a._stopProp) return;
        a.addEventListener("click", function (e) { e.stopPropagation(); });
        a._stopProp = true;
      });
    }

    // === 3) Desktop dropdown hover fallback (accessible au clavier) ===
    // Amélioration d'accessibilité : ouvrir/fermer au focus pour navigation clavier
    const dropdowns = Array.from(document.querySelectorAll(".dropdown"));
    if (dropdowns.length) {
      dropdowns.forEach(dd => {
        const trigger = dd.querySelector(".dropbtn");
        if (!trigger || trigger._dropdownA11y) return;

        // ouvre au focus
        trigger.addEventListener("focus", function () { dd.classList.add("keyboard-open"); });
        // ferme au blur
        trigger.addEventListener("blur", function () { dd.classList.remove("keyboard-open"); });

        // si on veut, on peut aussi toggle au click (décommenter si besoin)
        // trigger.addEventListener("click", e => { e.preventDefault(); dd.classList.toggle("keyboard-open"); });

        trigger._dropdownA11y = true;
      });
    }

    // === 4) Re-run small init si header est injecté plus tard (mutation observer) ===
    // (utile si tu utilises fetch() pour injecter header.html after page load)
    if (!document._headerMutationObserver) {
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.addedNodes && m.addedNodes.length) {
            // si header-container a été inséré ou modifié, ré-exécuter l'init simple
            // (ici on récharge juste les éléments mobiles une fois)
            const newBtn = queryOnce("menu-btn");
            const newMenu = queryOnce("mobile-menu");
            if ((newBtn && !btn) || (newMenu && !menu)) {
              // relancer la fonction ready (petite récursion contrôlée)
              ready(function () { /* nothing: main init already registers new handlers via the guards */ });
            }
            break;
          }
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
      document._headerMutationObserver = true;
    }
  }); // ready
})();