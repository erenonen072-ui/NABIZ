"use strict";

const haberler = window.NABIZ_HABERLER || [];

/* =========================================
   HABER KARTI
========================================= */

function haberKart(haber) {
    return `
        <article class="news-card">
            <a href="/haberler/${haber.slug}.html">
                <div class="news-image">
                    <img
                        src="${haber.gorsel || "/images/haber.jpg"}"
                        alt="${haber.baslik || "NABIZ Haber"}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='/images/haber.jpg';"
                    >
                </div>

                <div class="news-card-title">
                    <h3>${haber.baslik || ""}</h3>
                </div>
            </a>
        </article>
    `;
}

/* =========================================
   HABERLERİ TARİHE GÖRE SIRALA
========================================= */

function tariheGoreSirala(liste) {
    return [...liste].sort((a, b) => {
        return (
            new Date(b.tarihISO || 0) -
            new Date(a.tarihISO || 0)
        );
    });
}

/* =========================================
   SON HABERLER
========================================= */

function sonHaberleriYukle() {
    const alan = document.querySelector("#latestNews");

    if (!alan) return;

    const liste = tariheGoreSirala(haberler).slice(0, 8);

    alan.innerHTML = liste.length
        ? liste.map(haberKart).join("")
        : '<p class="empty-news">Henüz haber bulunmuyor.</p>';
}

/* =========================================
   ÇOK OKUNANLAR
========================================= */

function cokOkunanlariYukle() {
    const alan = document.querySelector("#popularNews");

    if (!alan) return;

    const liste = [...haberler]
        .sort((a, b) => {
            return (b.goruntulenme || 0) -
                   (a.goruntulenme || 0);
        })
        .slice(0, 4);

    alan.innerHTML = liste.length
        ? liste.map((haber, index) => `
            <article class="popular-card">
                <a href="/haberler/${haber.slug}.html">
                    <img
                        src="${haber.gorsel || "/images/haber.jpg"}"
                        alt="${haber.baslik || "NABIZ Haber"}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='/images/haber.jpg';"
                    >

                    <span class="popular-number">
                        ${index + 1}
                    </span>

                    <h3>${haber.baslik || ""}</h3>
                </a>
            </article>
        `).join("")
        : '<p class="empty-news">Henüz haber bulunmuyor.</p>';
}

/* =========================================
   KATEGORİLER
========================================= */

function kategoriYukle(id, kategori) {
    const alan = document.getElementById(id);

    if (!alan) return;

    const liste = tariheGoreSirala(
        haberler.filter(haber =>
            haber.kategori === kategori
        )
    ).slice(0, 4);

    alan.innerHTML = liste.length
        ? liste.map(haberKart).join("")
        : '<p class="empty-news">Bu kategoride henüz haber bulunmuyor.</p>';
}

/* =========================================
   MANŞET
========================================= */

function heroYukle() {
    const alan = document.getElementById("hero");
    const pagination = document.getElementById("heroPagination");

    if (!alan) return;

    const liste = tariheGoreSirala(haberler).slice(0, 20);

    if (!liste.length) {
        alan.innerHTML = '<p class="empty-news">Henüz manşet haberi bulunmuyor.</p>';
        if (pagination) pagination.innerHTML = "";
        return;
    }

    let aktif = 0;
    let zamanlayici;

    function goster(index) {
        aktif = index;

        const haber = liste[index];

        alan.innerHTML = `
            <a
                href="/haberler/${haber.slug}.html"
                class="hero-link"
                aria-label="${haber.baslik || "Haberi oku"}"
            >
                <img
                    src="${haber.gorsel || "/images/haber.jpg"}"
                    alt="${haber.baslik || "NABIZ Manşet"}"
                    class="hero-image"
                    fetchpriority="${index === 0 ? "high" : "auto"}"
                    onerror="this.onerror=null;this.src='/images/haber.jpg';"
                >

                <div class="hero-overlay">
                    <h1>${haber.baslik || ""}</h1>
                </div>
            </a>
        `;

        paginationGuncelle();
    }

    function paginationGuncelle() {
        if (!pagination) return;

        pagination.innerHTML = liste.map((haber, index) => `
            <button
                type="button"
                class="${index === aktif ? "active" : ""}"
                data-hero="${index}"
                aria-label="${index + 1}. manşeti göster"
                aria-pressed="${index === aktif}"
            >
                ${index + 1}
            </button>
        `).join("");

        pagination.querySelectorAll("[data-hero]").forEach(button => {
            button.addEventListener("click", () => {
                goster(Number(button.dataset.hero));
                zamanlayiciyiBaslat();
            });
        });
    }

    function zamanlayiciyiBaslat() {
        clearInterval(zamanlayici);

        if (liste.length > 1) {
            zamanlayici = setInterval(() => {
                goster((aktif + 1) % liste.length);
            }, 6500);
        }
    }

    goster(0);
    zamanlayiciyiBaslat();
}

/* =========================================
   ARAMA
========================================= */

function aramaSistemi() {
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");
    const clear = document.getElementById("searchClear");
    const panel = document.getElementById("searchPanel");
    const open = document.getElementById("searchOpen");

    if (input && results) {
        function ara() {
            const kelime = input.value
                .trim()
                .toLocaleLowerCase("tr-TR");

            if (!kelime) {
                results.innerHTML = "";
                return;
            }

            const bulunanlar = haberler.filter(haber => {
                const metin = [
                    haber.baslik,
                    haber.spot,
                    haber.kategori
                ].join(" ").toLocaleLowerCase("tr-TR");

                return metin.includes(kelime);
            });

            results.innerHTML = bulunanlar.length
                ? bulunanlar.map(haber => `
                    <a
                        class="search-result"
                        href="/haberler/${haber.slug}.html"
                    >
                        <strong>${haber.baslik || ""}</strong>
                        <small>${haber.kategori || "Haber"}</small>
                    </a>
                `).join("")
                : `
                    <div class="search-empty">
                        <strong>Haber bulunamadı</strong>
                        <p>Başka bir kelime deneyebilirsin.</p>
                    </div>
                `;
        }

        input.addEventListener("input", ara);

        if (clear) {
            clear.addEventListener("click", () => {
                input.value = "";
                results.innerHTML = "";
                input.focus();
            });
        }
    }

    if (open && panel) {
        open.addEventListener("click", () => {
            const acik = panel.classList.toggle("active");

            if (acik && input) {
                input.focus();
            }
        });
    }
}

/* =========================================
   MOBİL MENÜ
========================================= */

function mobilMenu() {
    const button = document.getElementById("menuButton");
    const menu = document.getElementById("mobileMenu");

    if (!button || !menu) return;

    function menuDurumunuAyarla(acik) {
        menu.classList.toggle("mobile-open", acik);

        button.setAttribute("aria-expanded", String(acik));

        button.innerHTML = acik
            ? '✕ <span>KAPAT</span>'
            : '☰ <span>MENÜ</span>';
    }

    button.addEventListener("click", () => {
        const acik = !menu.classList.contains("mobile-open");
        menuDurumunuAyarla(acik);
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menuDurumunuAyarla(false);
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            menuDurumunuAyarla(false);
        }
    });

    document.addEventListener("click", event => {
        if (
            window.innerWidth <= 600 &&
            menu.classList.contains("mobile-open") &&
            !menu.contains(event.target) &&
            !button.contains(event.target)
        ) {
            menuDurumunuAyarla(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 600) {
            menuDurumunuAyarla(false);
        }
    });
}

/* =========================================
   TEMA
========================================= */

function temaSistemi() {
    const button = document.getElementById("themeButton");

    if (!button) return;

    button.addEventListener("click", () => {
        const koyu = document.body.classList.toggle("dark-mode");

        button.setAttribute("aria-pressed", String(koyu));
    });
}

/* =========================================
   SAYFAYI BAŞLAT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    if (!haberler.length) {
        console.error(
            "NABIZ: haberler.js yüklenemedi veya haber listesi boş."
        );
    } else {
        heroYukle();
        sonHaberleriYukle();
        cokOkunanlariYukle();

        kategoriYukle("gundemNews", "Gündem");
        kategoriYukle("ekonomiNews", "Ekonomi");
        kategoriYukle("sporNews", "Spor");
        kategoriYukle("dunyaNews", "Dünya");
        kategoriYukle("teknolojiNews", "Teknoloji");
    }

    aramaSistemi();
    mobilMenu();
    temaSistemi();
});
