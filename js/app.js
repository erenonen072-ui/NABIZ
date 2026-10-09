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

/* =========================================
   HABER KARTI
   SADECE FOTOĞRAF + BAŞLIK
========================================= */

function haberKart(haber) {
    return `
        <article class="news-card">
            <a href="${haberUrl(haber)}">

                <div class="news-image">
                    <img
                        src="${haberGorsel(haber)}"
                        alt="${haber.baslik || "NABIZ Haber"}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
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
            return (
                (b.goruntulenme || 0) -
                (a.goruntulenme || 0)
            );
        })
        .slice(0, 4);

    alan.innerHTML = liste.length
        ? liste.map((haber, index) => `
            <article class="popular-card">

                <a href="${haberUrl(haber)}">

                    <img
                        src="${haberGorsel(haber)}"
                        alt="${haber.baslik || "NABIZ Haber"}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
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
   SOL = ANA HABER
   SAĞ = İKİNCİ HABER
   1-20 = MANŞET SEÇİCİ
========================================= */

function heroYukle() {
    const alan = document.getElementById("hero");
    const pagination = document.getElementById("heroPagination");

    if (!alan) return;

    /*
       En fazla ilk 20 haber manşette kullanılacak.
    */
    const liste = tariheGoreSirala(haberler).slice(0, 20);

    if (!liste.length) {
        alan.innerHTML = `
            <p class="empty-news">
                Henüz manşet haberi bulunmuyor.
            </p>
        `;

        if (pagination) {
            pagination.innerHTML = "";
        }

        return;
    }

    let aktif = 0;
    let zamanlayici = null;

    /* -----------------------------------------
       ANA MANŞET
    ----------------------------------------- */

    function anaManşetHTML(haber) {
        if (!haber) return "";

        return `
            <a
                href="${haberUrl(haber)}"
                class="hero-main-link"
                aria-label="${haber.baslik || "Haberi oku"}"
            >

                <img
                    src="${haberGorsel(haber)}"
                    alt="${haber.baslik || "NABIZ Manşet"}"
                    class="hero-main-image"
                    fetchpriority="high"
                    decoding="async"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                >

                <div class="hero-main-overlay">
                    <h1>
                        ${haber.baslik || ""}
                    </h1>
                </div>

            </a>
        `;
    }

    /* -----------------------------------------
       SAĞ MANŞET
    ----------------------------------------- */

    function yanManşetHTML(haber) {
        if (!haber) return "";

        return `
            <a
                href="${haberUrl(haber)}"
                class="hero-side-link"
                aria-label="${haber.baslik || "Haberi oku"}"
            >

                <img
                    src="${haberGorsel(haber)}"
                    alt="${haber.baslik || "NABIZ Haber"}"
                    class="hero-side-image"
                    loading="lazy"
                    decoding="async"
                    onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                >

                <div class="hero-side-overlay">
                    <h1>
                        ${haber.baslik || ""}
                    </h1>
                </div>

            </a>
        `;
    }

    /* -----------------------------------------
       MANŞETİ GÖSTER
    ----------------------------------------- */

    function goster(index) {
        if (index < 0) {
            index = 0;
        }

        if (index >= liste.length) {
            index = 0;
        }

        aktif = index;

        /*
           Sol tarafta seçilen haber.
           Sağ tarafta bir sonraki haber.
        */
        const anaHaber = liste[aktif];

        const yanIndex =
            (aktif + 1) % liste.length;

        const yanHaber = liste[yanIndex];

        alan.innerHTML = `
            <div class="hero-layout">

                <div class="hero-main">
                    ${anaManşetHTML(anaHaber)}
                </div>

                <div class="hero-side">
                    ${yanManşetHTML(yanHaber)}
                </div>

            </div>
        `;

        paginationGuncelle();
    }

    /* -----------------------------------------
       1 - 20 BUTONLARI
    ----------------------------------------- */

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

        pagination
            .querySelectorAll("[data-hero]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const yeniIndex =
                        Number(button.dataset.hero);

                    goster(yeniIndex);

                    zamanlayiciyiBaslat();
                });

            });
    }

    /* -----------------------------------------
       OTOMATİK MANŞET GEÇİŞİ
    ----------------------------------------- */

    function zamanlayiciyiBaslat() {
        clearInterval(zamanlayici);

        if (liste.length <= 1) {
            return;
        }

        zamanlayici = setInterval(() => {

            const sonraki =
                (aktif + 1) % liste.length;

            goster(sonraki);

        }, 6500);
    }

    /* -----------------------------------------
       BAŞLAT
    ----------------------------------------- */

    goster(0);

    zamanlayiciyiBaslat();
}

/* =========================================
   ARAMA SİSTEMİ
========================================= */

function aramaSistemi() {
    const input =
        document.getElementById("searchInput");

    const results =
        document.getElementById("searchResults");

    const clear =
        document.getElementById("searchClear");

    const panel =
        document.getElementById("searchPanel");

    const open =
        document.getElementById("searchOpen");

    if (input && results) {

        function ara() {

            const kelime =
                input.value
                    .trim()
                    .toLocaleLowerCase("tr-TR");

            if (!kelime) {
                results.innerHTML = "";
                return;
            }

            const bulunanlar =
                haberler.filter(haber => {

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

            results.innerHTML =
                bulunanlar.length

                    ? bulunanlar.map(haber => `
                        <a
                            class="search-result"
                            href="${haberUrl(haber)}"
                        >

                            <strong>
                                ${haber.baslik || ""}
                            </strong>

                            <small>
                                ${haber.kategori || "Haber"}
                            </small>

                        </a>
                    `).join("")

                    : `
                        <div class="search-empty">

                            <strong>
                                Haber bulunamadı
                            </strong>

                            <p>
                                Başka bir kelime deneyebilirsin.
                            </p>

                        </div>
                    `;
        }

        input.addEventListener(
            "input",
            ara
        );

        if (clear) {

            clear.addEventListener(
                "click",
                () => {

                    input.value = "";

                    results.innerHTML = "";

                    input.focus();
                }
            );

        }
    }

    /* -----------------------------------------
       ARAMA PANELİNİ AÇ
    ----------------------------------------- */

    if (open && panel) {

        open.addEventListener(
            "click",
            () => {

                const acik =
                    panel.classList.toggle("active");

                if (acik && input) {
                    input.focus();
                }
            }
        );

    }
}

/* =========================================
   MOBİL MENÜ
========================================= */

function mobilMenu() {

    const button =
        document.getElementById("menuButton");

    const menu =
        document.getElementById("mobileMenu");

    if (!button || !menu) return;

    function menuDurumunuAyarla(acik) {

        menu.classList.toggle(
            "mobile-open",
            acik
        );

        button.setAttribute(
            "aria-expanded",
            String(acik)
        );

        button.innerHTML =
            acik
                ? '✕ <span>KAPAT</span>'
                : '☰ <span>MENÜ</span>';
    }

    /* Menü butonu */

    button.addEventListener(
        "click",
        () => {

            const acik =
                !menu.classList.contains(
                    "mobile-open"
                );

            menuDurumunuAyarla(acik);
        }
    );

    /* Menüdeki linklere basınca kapat */

    menu.querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {
                    menuDurumunuAyarla(false);
                }
            );

        });

    /* ESC ile kapat */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {
                menuDurumunuAyarla(false);
            }

        }
    );

    /* Dışarı tıklayınca kapat */

    document.addEventListener(
        "click",
        event => {

            if (
                window.innerWidth <= 600 &&
                menu.classList.contains(
                    "mobile-open"
                ) &&
                !menu.contains(event.target) &&
                !button.contains(event.target)
            ) {

                menuDurumunuAyarla(false);
            }

        }
    );

    /* Ekran büyüyünce mobil menüyü kapat */

    window.addEventListener(
        "resize",
        () => {

            if (window.innerWidth > 600) {
                menuDurumunuAyarla(false);
            }

        }
    );
}

/* =========================================
   TEMA SİSTEMİ
========================================= */

function temaSistemi() {

    const button =
        document.getElementById("themeButton");

    if (!button) return;

    button.addEventListener(
        "click",
        () => {

            const koyu =
                document.body.classList.toggle(
                    "dark-mode"
                );

            button.setAttribute(
                "aria-pressed",
                String(koyu)
            );
        }
    );
}

/* =========================================
   SAYFAYI BAŞLAT
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!haberler.length) {

            console.error(
                "NABIZ: haberler.js yüklenemedi veya haber listesi boş."
            );

        } else {

            /* Manşet */

            heroYukle();

            /* Son haberler */

            sonHaberleriYukle();

            /* Çok okunanlar */

            cokOkunanlariYukle();

            /* Kategoriler */

            kategoriYukle(
                "gundemNews",
                "Gündem"
            );

            kategoriYukle(
                "ekonomiNews",
                "Ekonomi"
            );

            kategoriYukle(
                "sporNews",
                "Spor"
            );

            kategoriYukle(
                "dunyaNews",
                "Dünya"
            );

            kategoriYukle(
                "teknolojiNews",
                "Teknoloji"
            );
        }

        /* Arama */

        aramaSistemi();

        /* Mobil menü */

        mobilMenu();

        /* Tema */

        temaSistemi();
    }
);
