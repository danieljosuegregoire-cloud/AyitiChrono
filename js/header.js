// ==============================
// header.js – Gestion du menu et chargement dynamique
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // ------------------------------
    // 1️⃣ Charger dynamiquement le HEADER
    // ------------------------------
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;

                // Une fois le header chargé, on peut initialiser le menu mobile
                initMobileMenu();
            })
            .catch(err => console.error("Erreur chargement header :", err));
    }

    // ------------------------------
    // 2️⃣ Charger dynamiquement le FOOTER
    // ------------------------------
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(err => console.error("Erreur chargement footer :", err));
    }

    // ------------------------------
    // 3️⃣ Fonction d'initialisation du menu mobile
    // ------------------------------
    function initMobileMenu() {
        const menuBtn = document.querySelector(".menu-btn");
        const mobileMenu = document.querySelector(".mobile-menu");

        if (!menuBtn || !mobileMenu) return; // pas de menu, rien à faire

        // Ouvrir / fermer le menu au clic
        menuBtn.addEventListener("click", function (e) {
            e.stopPropagation(); // empêche la propagation
            mobileMenu.classList.toggle("active");
        });

        // Empêche fermeture si on clique dans le menu
        mobileMenu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        // Ferme le menu si on clique ailleurs
        document.addEventListener("click", function () {
            mobileMenu.classList.remove("active");
        });

        // Ferme le menu avec la touche Échap
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                mobileMenu.classList.remove("active");
            }
        });
    }
});