"use strict";

const haberler = window.NABIZ_HABERLER || [];

/* =========================================
   YARDIMCI FONKSİYONLAR
========================================= */

const FALLBACK_IMAGE = "/images/haber.jpg";

function haberUrl(haber) {
    return haber && haber.slug
        ? `/haberler/${haber.slug}.html`
        : "#";
}

function haberGorsel(haber) {
    return haber && haber.gorsel
        ? haber.gorsel
        : FALLBACK_IMAGE;
}

function htmlGuvenli(metin) {
    return String(metin || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================
   HABER KARTI
   SADECE FOTOĞRAF + BAŞLIK
   YENİ SEKMEDE AÇILIR
========================================= */

function haberKart(haber) {
    return `
        <article class="news-card">
            <a
                href="${haberUrl(haber)}"
                target="_blank"
                rel="noopener noreferrer"
            >
                <div class="news-image">
                    <img
                        src="${haberGorsel(haber)}"
                        alt="${htmlGuvenli(haber.baslik || "NABIZ Haber")}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                    >
                </div>

                <div class="news-card-title">
                    <h3>${htmlGuvenli(haber.baslik)}</h3>
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
   YENİ SEKMEDE AÇILIR
========================================= */

function cokOkunanlariYukle() {
    const alan = document.querySelector("#popularNews");

    if (!alan) return;

    const liste = [...haberler]
        .sort((a, b) => {
            return (
                (b.goruntulenme || 0) -
                (a.goruntulenme || 0)
            );
        })
        .slice(0, 4);

    alan.innerHTML = liste.length
        ? liste.map((haber, index) => `
            <article class="popular-card">
                <a
                    href="${haberUrl(haber)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src="${haberGorsel(haber)}"
                        alt="${htmlGuvenli(haber.baslik || "NABIZ Haber")}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                    >

                    <span class="popular-number">
                        ${index + 1}
                    </span>

                    <h3>${htmlGuvenli(haber.baslik)}</h3>
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
   SOL = ANA HABER
   SAĞ = İKİNCİ HABER
   1-20 = MANŞET SEÇİCİ

   HABERLER YENİ SEKMEDE AÇILIR
========================================= */

function heroYukle() {
    const alan = document.getElementById("hero");

    if (!alan) return;

    const liste = tariheGoreSirala(haberler).slice(0, 20);

    if (!liste.length) {
        alan.innerHTML = `
            <p class="empty-news">
                Henüz manşet haberi bulunmuyor.
            </p>
        `;
        return;
    }

    let anaAktif = 0;
    let yanAktif = liste.length > 1 ? 1 : 0;

    let anaTimer = null;
    let yanTimer = null;


    function haberLink(haber) {
        return haber && haber.slug
            ? `/haberler/${haber.slug}.html`
            : "#";
    }


    function gorsel(haber) {
        return haber && haber.gorsel
            ? haber.gorsel
            : FALLBACK_IMAGE;
    }


    function anaManşetHTML(haber) {
        return `
            <a
                href="${haberLink(haber)}"
                target="_blank"
                rel="noopener noreferrer"
                class="hero-main-link"
                aria-label="${haber.baslik || "Haberi oku"}"
            >

                <img
                    src="${gorsel(haber)}"
                    alt="${haber.baslik || "NABIZ Manşet"}"
                    class="hero-main-image"
                    fetchpriority="high"
                    decoding="async"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                >

                <div class="hero-main-overlay">
                    <h1>${haber.baslik || ""}</h1>
                </div>

            </a>
        `;
    }


    function yanManşetHTML(haber) {
        return `
            <a
                href="${haberLink(haber)}"
                target="_blank"
                rel="noopener noreferrer"
                class="hero-side-link"
                aria-label="${haber.baslik || "Haberi oku"}"
            >

                <img
                    src="${gorsel(haber)}"
                    alt="${haber.baslik || "NABIZ Haber"}"
                    class="hero-side-image"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                >

                <div class="hero-side-overlay">
                    <h2>${haber.baslik || ""}</h2>
                </div>

            </a>
        `;
    }


    function numaralar(tip, aktif) {

        return `
            <div
                class="hero-selectors hero-selectors-${tip}"
                aria-label="${tip === "main" ? "Ana manşet seçimi" : "Yan manşet seçimi"}"
            >

                ${liste.map((haber, index) => `
                    <button
                        type="button"
                        class="${index === aktif ? "active" : ""}"
                        data-hero-type="${tip}"
                        data-hero-index="${index}"
                        aria-label="${index + 1}. haberi göster"
                        aria-pressed="${index === aktif}"
                    >
                        ${index + 1}
                    </button>
                `).join("")}

            </div>
        `;
    }


    function render() {

        const anaHaber = liste[anaAktif];
        const yanHaber = liste[yanAktif];

        alan.innerHTML = `

            <div class="hero-layout">

                <!-- ANA MANŞET -->

                <div class="hero-main-wrapper">

                    <div class="hero-main">
                        ${anaManşetHTML(anaHaber)}
                    </div>

                    ${numaralar("main", anaAktif)}

                </div>


                <!-- YAN MANŞET -->

                <div class="hero-side-wrapper">

                    <div class="hero-side">
                        ${yanManşetHTML(yanHaber)}
                    </div>

                    ${numaralar("side", yanAktif)}

                </div>

            </div>

        `;


        alan.querySelectorAll("[data-hero-type]").forEach(button => {

            button.addEventListener("click", () => {

                const tip = button.dataset.heroType;
                const index = Number(button.dataset.heroIndex);

                if (tip === "main") {

                    anaAktif = index;

                    if (anaAktif === yanAktif && liste.length > 1) {
                        yanAktif = (anaAktif + 1) % liste.length;
                    }

                    render();
                    anaTimerBaslat();

                } else {

                    yanAktif = index;

                    if (yanAktif === anaAktif && liste.length > 1) {
                        yanAktif = (yanAktif + 1) % liste.length;
                    }

                    render();
                    yanTimerBaslat();

                }

            });

        });

    }


    function anaTimerBaslat() {

        clearInterval(anaTimer);

        if (liste.length <= 1) return;

        anaTimer = setInterval(() => {

            anaAktif = (anaAktif + 1) % liste.length;

            if (anaAktif === yanAktif && liste.length > 1) {
                anaAktif = (anaAktif + 1) % liste.length;
            }

            render();

        }, 6500);

    }


    function yanTimerBaslat() {

        clearInterval(yanTimer);

        if (liste.length <= 1) return;

        yanTimer = setInterval(() => {

            yanAktif = (yanAktif + 1) % liste.length;

            if (yanAktif === anaAktif && liste.length > 1) {
                yanAktif = (yanAktif + 1) % liste.length;
            }

            render();

        }, 6500);

    }


    render();

    anaTimerBaslat();
    yanTimerBaslat();
}

/* =========================================
   ARAMA SİSTEMİ
   SONUÇLAR YENİ SEKMEDE AÇILIR
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
                    haber.kategori,
                    haber.kaynak,
                    Array.isArray(haber.icerik)
                        ? haber.icerik.join(" ")
                        : haber.icerik || ""
                ]
                    .join(" ")
                    .toLocaleLowerCase("tr-TR");

                return metin.includes(kelime);
            });

            results.innerHTML = bulunanlar.length
                ? bulunanlar.map(haber => `
                    <a
                        class="search-result"
                        href="${haberUrl(haber)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <strong>
                            ${htmlGuvenli(haber.baslik)}
                        </strong>

                        <small>
                            ${htmlGuvenli(haber.kategori || "Haber")}
                        </small>
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

    /* ARAMA PANELİNİ AÇ */

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

        button.setAttribute(
            "aria-expanded",
            String(acik)
        );

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
   TEMA SİSTEMİ
========================================= */

function temaSistemi() {
    const button = document.getElementById("themeButton");

    if (!button) return;

    button.addEventListener("click", () => {
        const koyu = document.body.classList.toggle("dark-mode");

        button.setAttribute(
            "aria-pressed",
            String(koyu)
        );
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
