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
                        src="${haber.gorsel || '/images/haber.jpg'}"
                        alt="${haber.baslik || 'NABIZ Haber'}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='/images/haber.jpg';"
                    >
                </div>

                <div class="news-card-title">
                    <h3>${haber.baslik || ''}</h3>
                </div>

            </a>
        </article>
    `;
}


/* =========================================
   TARİHE GÖRE SIRALA
========================================= */

function tariheGoreSirala(liste) {
    return [...liste].sort((a, b) => {
        return new Date(b.tarihISO || 0) -
               new Date(a.tarihISO || 0);
    });
}


/* =========================================
   SON HABERLER
========================================= */

function sonHaberleriYukle() {

    const alan = document.querySelector("#latestNews");

    if (!alan) return;

    const liste = tariheGoreSirala(haberler)
        .slice(0, 8);

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
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
        .slice(0, 5);

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================================
   KATEGORİ HABERLERİ
========================================= */

function kategoriYukle(id, kategori) {

    const alan = document.querySelector(`#${id}`);

    if (!alan) return;

    const liste = tariheGoreSirala(
        haberler.filter(haber =>
            haber.kategori === kategori
        )
    ).slice(0, 4);

    if (!liste.length) {
        alan.innerHTML = `
            <div class="empty-news">
                Bu kategoride henüz haber bulunmuyor.
            </div>
        `;
        return;
    }

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================================
   HERO
========================================= */

function heroYukle() {

    const alan = document.querySelector("#hero");

    if (!alan) return;

    const liste = tariheGoreSirala(haberler)
        .slice(0, 20);

    if (!liste.length) return;

    let aktif = 0;

    function goster(index) {

        const haber = liste[index];

        alan.innerHTML = `
            <a
                href="/haberler/${haber.slug}.html"
                class="hero-link"
            >

                <img
                    src="${haber.gorsel || '/images/haber.jpg'}"
                    alt="${haber.baslik}"
                    class="hero-image"
                    onerror="this.onerror=null;this.src='/images/haber.jpg';"
                >

                <div class="hero-overlay">
                    <h1>${haber.baslik}</h1>
                </div>

            </a>
        `;

        paginationGuncelle(index);
    }


    function paginationGuncelle(index) {

        const pagination =
            document.querySelector("#heroPagination");

        if (!pagination) return;

        pagination.innerHTML = liste
            .map((haber, i) => `
                <button
                    type="button"
                    class="${i === index ? "active" : ""}"
                    data-hero="${i}"
                    aria-label="${haber.baslik}"
                >
                    ${i + 1}
                </button>
            `)
            .join("");

        pagination
            .querySelectorAll("[data-hero]")
            .forEach(button => {

                button.addEventListener("click", () => {

                    aktif = Number(
                        button.dataset.hero
                    );

                    goster(aktif);

                });

            });
    }


    goster(aktif);


    if (liste.length > 1) {

        setInterval(() => {

            aktif++;

            if (aktif >= liste.length) {
                aktif = 0;
            }

            goster(aktif);

        }, 6500);

    }
}


/* =========================================
   ARAMA
========================================= */

function aramaSistemi() {

    const input =
        document.querySelector("#searchInput");

    const results =
        document.querySelector("#searchResults");

    const clear =
        document.querySelector("#searchClear");

    const panel =
        document.querySelector("#searchPanel");

    const open =
        document.querySelector("#searchOpen");

    if (!input || !results) return;


    function ara() {

        const kelime = input.value
            .trim()
            .toLocaleLowerCase("tr-TR");


        if (!kelime) {

            results.innerHTML = "";

            return;
        }


        const bulunanlar = haberler.filter(haber => {

            const baslik =
                (haber.baslik || "")
                .toLocaleLowerCase("tr-TR");

            const spot =
                (haber.spot || "")
                .toLocaleLowerCase("tr-TR");

            const kategori =
                (haber.kategori || "")
                .toLocaleLowerCase("tr-TR");

            return (
                baslik.includes(kelime) ||
                spot.includes(kelime) ||
                kategori.includes(kelime)
            );

        });


        if (!bulunanlar.length) {

            results.innerHTML = `
                <div class="search-empty">
                    <strong>Haber bulunamadı</strong>
                    <p>
                        "${input.value}" için sonuç bulunamadı.
                    </p>
                </div>
            `;

            return;
        }


        results.innerHTML = bulunanlar
            .map(haberKart)
            .join("");
    }


    input.addEventListener("input", ara);


    if (clear) {

        clear.addEventListener("click", () => {

            input.value = "";

            results.innerHTML = "";

            input.focus();

        });

    }


    if (open && panel) {

        open.addEventListener("click", () => {

            panel.classList.toggle("active");

            if (panel.classList.contains("active")) {
                input.focus();
            }

        });

    }

}


/* =========================================
   TEMA
========================================= */

function temaSistemi() {

    const button =
        document.querySelector("#themeButton");

    if (!button) return;

    button.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

    });

}


/* =========================================
   SAYFA BAŞLAT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (!haberler.length) {

        console.error(
            "NABIZ: haberler.js yüklenemedi veya haber bulunamadı."
        );

        return;
    }


    heroYukle();

    sonHaberleriYukle();

    cokOkunanlariYukle();


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


    aramaSistemi();

    temaSistemi();

});
