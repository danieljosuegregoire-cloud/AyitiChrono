// ==============================
// Gestion du menu mobile
// ==============================

// Sélectionne le bouton burger et le menu
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.querySelector(".mobile-menu");

// Vérifie que les éléments existent (pour éviter les erreurs sur certaines pages)
if (menuBtn && mobileMenu) {

    // Ouvre / ferme le menu quand on clique sur l'icône
    menuBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // Empêche propagation
        mobileMenu.classList.toggle("active");
    });

    // Empêche la fermeture si on clique dans le menu
    mobileMenu.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    // Ferme le menu si on clique ailleurs
    document.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
    });

    // Ferme avec la touche Échap
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            mobileMenu.classList.remove("active");
        }
    });
}

// ==============================
// Chargement dynamique du HEADER et FOOTER
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // Charge le HEADER
    const headerContainer = document.getElementById("header-container");
    if (headerContainer) {
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;
            })
            .catch(err => console.error("Erreur chargement header :", err));
    }

    // Charge le FOOTER
    const footerContainer = document.getElementById("footer-container");
    if (footerContainer) {
        fetch("footer.html")
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            })
            .catch(err => console.error("Erreur chargement footer :", err));
    }
});
