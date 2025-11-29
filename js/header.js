// ==============================
// Chargement dynamique du HEADER et FOOTER
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // --------- CHARGEMENT HEADER ---------
    const headerContainer = document.getElementById("header-container");

    if (headerContainer) {
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                headerContainer.innerHTML = data;

                // ==============================
                // Gestion du menu mobile (PLACÉ ICI)
                // ==============================

                const menuBtn = document.querySelector(".menu-btn");
                const mobileMenu = document.querySelector(".mobile-menu");

                if (menuBtn && mobileMenu) {

                    menuBtn.addEventListener("click", function (e) {
                        e.stopPropagation();
                        mobileMenu.classList.toggle("active");
                    });

                    mobileMenu.addEventListener("click", function (e) {
                        e.stopPropagation();
                    });

                    document.addEventListener("click", function () {
                        mobileMenu.classList.remove("active");
                    });

                    document.addEventListener("keydown", function (e) {
                        if (e.key === "Escape") {
                            mobileMenu.classList.remove("active");
                        }
                    });
                }
            })
            .catch(err => console.error("Erreur chargement header :", err));
    }

    // --------- CHARGEMENT FOOTER ----------
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