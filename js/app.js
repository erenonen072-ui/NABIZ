document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    /* =========================
       TARİH
    ========================= */

    const todayDate = document.getElementById("todayDate");

    function updateDate() {
        const now = new Date();

        const date = now.toLocaleDateString("tr-TR", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        if (todayDate) {
            todayDate.textContent = date;
        }
    }

    updateDate();


    /* =========================
       SAAT
    ========================= */

    const liveTime = document.getElementById("liveTime");

    function updateTime() {

        const now = new Date();

        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        if (liveTime) {
            liveTime.textContent = `${hours}:${minutes}`;
        }
    }

    updateTime();
    setInterval(updateTime, 1000);


    /* =========================
       TEMA
    ========================= */

    const themeBtn = document.getElementById("themeBtn");

    const savedTheme = localStorage.getItem("nabiz-theme");

    if (savedTheme === "dark") {
        body.classList.add("dark");
    }

    themeBtn?.addEventListener("click", () => {

        body.classList.toggle("dark");

        localStorage.setItem(
            "nabiz-theme",
            body.classList.contains("dark") ? "dark" : "light"
        );

    });


    /* =========================
       ARAMA
    ========================= */

    const searchBtn = document.getElementById("searchBtn");
    const mobileSearch = document.getElementById("mobileSearch");
    const searchOverlay = document.getElementById("searchOverlay");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
    const doSearch = document.getElementById("doSearch");

    function openSearch() {

        searchOverlay?.classList.add("active");

        setTimeout(() => {
            searchInput?.focus();
        }, 150);

    }

    function closeSearchOverlay() {
        searchOverlay?.classList.remove("active");
    }

    searchBtn?.addEventListener("click", openSearch);
    mobileSearch?.addEventListener("click", openSearch);
    closeSearch?.addEventListener("click", closeSearchOverlay);


    searchOverlay?.addEventListener("click", (e) => {

        if (e.target === searchOverlay) {
            closeSearchOverlay();
        }

    });


    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closeSearchOverlay();
            closeMobileMenu();
        }

        if (
            e.key === "/" &&
            document.activeElement !== searchInput
        ) {
            e.preventDefault();
            openSearch();
        }

    });


    function performSearch() {

        const value = searchInput?.value.trim();

        if (!value) {
            showToast("Aramak istediğin konuyu yaz.");
            return;
        }

        showToast(`"${value}" için arama yapılıyor...`);

        setTimeout(() => {

            closeSearchOverlay();

        }, 700);

    }

    doSearch?.addEventListener("click", performSearch);

    searchInput?.addEventListener("keydown", (e) => {

        if (e.key === "Enter") {
            performSearch();
        }

    });


    /* =========================
       ARAMA ÖNERİLERİ
    ========================= */

    document.querySelectorAll(".search-suggestions button")
        .forEach(button => {

            button.addEventListener("click", () => {

                if (searchInput) {
                    searchInput.value = button.textContent;
                    searchInput.focus();
                }

            });

        });


    /* =========================
       MOBİL MENÜ
    ========================= */

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");

    function openMobileMenu() {
        mobileMenu?.classList.add("active");
        body.style.overflow = "hidden";
    }

    function closeMobileMenu() {
        mobileMenu?.classList.remove("active");
        body.style.overflow = "";
    }

    mobileMenuBtn?.addEventListener("click", openMobileMenu);
    closeMenu?.addEventListener("click", closeMobileMenu);


    document.querySelectorAll(".mobile-menu-links a")
        .forEach(link => {

            link.addEventListener("click", () => {
                closeMobileMenu();
            });

        });


    /* =========================
       FİLTRELER
    ========================= */

    document.querySelectorAll(".filter")
        .forEach(button => {

            button.addEventListener("click", () => {

                document.querySelectorAll(".filter")
                    .forEach(item => item.classList.remove("active"));

                button.classList.add("active");

                showToast(`${button.textContent} haberleri gösteriliyor.`);

            });

        });


    /* =========================
       DAHA FAZLA HABER
    ========================= */

    const loadMore = document.querySelector(".load-more");

    loadMore?.addEventListener("click", () => {

        loadMore.innerHTML = "Haberler yükleniyor...";

        setTimeout(() => {

            loadMore.innerHTML = "Daha fazla haber göster <span>↓</span>";

            showToast("Yeni haberler hazır olduğunda burada görünecek.");

        }, 900);

    });


    /* =========================
       E-POSTA
    ========================= */

    const newsletterForm =
        document.getElementById("newsletterForm");

    newsletterForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        const email =
            newsletterForm.querySelector("input").value.trim();

        if (!email) return;

        newsletterForm.reset();

        showToast("NABIZ'a başarıyla abone oldun.");

    });


    /* =========================
       ABONE BUTONU
    ========================= */

    document.querySelector(".subscribe-btn")
        ?.addEventListener("click", () => {

            document.querySelector(".newsletter")
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

        });


    /* =========================
       SON DAKİKA
    ========================= */

    const breakingText =
        document.getElementById("breakingText");

    const breakingNews = [
        "Gündemdeki son gelişmeler NABIZ'da.",
        "Türkiye ve dünyadan önemli gelişmeler takip ediliyor.",
        "Günün öne çıkan haberleri NABIZ'da.",
        "Son dakika gelişmeleri için NABIZ'ı takip edin."
    ];

    let breakingIndex = 0;

    setInterval(() => {

        breakingIndex =
            (breakingIndex + 1) % breakingNews.length;

        if (breakingText) {

            breakingText.style.opacity = "0";

            setTimeout(() => {

                breakingText.textContent =
                    breakingNews[breakingIndex];

                breakingText.style.opacity = "1";

            }, 200);

        }

    }, 5000);


    /* =========================
       TOAST
    ========================= */

    const toast = document.getElementById("toast");
    const toastText = toast?.querySelector("p");

    let toastTimer;

    function showToast(message) {

        if (!toast) return;

        if (toastText) {
            toastText.textContent = message;
        }

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);

    }


    /* =========================
       HOVER / HABER TIKLAMA
    ========================= */

    document.querySelectorAll(".news-card, .small-news")
        .forEach(card => {

            card.addEventListener("click", () => {

                showToast(
                    "Haber detay sayfasına yönlendirilecek."
                );

            });

        });


    /* =========================
       GÖRSEL YÜKLEME HAZIRLIĞI
    ========================= */

    document.querySelectorAll(
        ".main-image, .small-image, .card-image"
    ).forEach(image => {

        image.style.cursor = "pointer";

    });


    /* =========================
       MOBİL ALT MENÜ
    ========================= */

    document.querySelectorAll(".mobile-bottom-nav a")
        .forEach(link => {

            link.addEventListener("click", () => {

                document.querySelectorAll(
                    ".mobile-bottom-nav a"
                ).forEach(item => {
                    item.classList.remove("active");
                });

                link.classList.add("active");

            });

        });


    /* =========================
       SAYFA YÜKLENDİ
    ========================= */

    console.log(
        "%c NABIZ ",
        "background:#e30613;color:#fff;font-size:20px;font-weight:bold;padding:5px 10px;"
    );

    console.log(
        "Gündemin nabzı burada."
    );

});
