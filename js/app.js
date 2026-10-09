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
                        onerror="this.onerror=null; this.src='/images/haber.jpg';"
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
   SON HABERLER
========================================= */

function sonHaberleriYukle() {

    const alan = document.querySelector("#son-haberler");

    if (!alan) return;

    const liste = [...haberler]
        .sort((a, b) => {

            const tarihA = new Date(a.tarihISO || 0).getTime();
            const tarihB = new Date(b.tarihISO || 0).getTime();

            return tarihB - tarihA;

        })
        .slice(0, 8);

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================================
   ÇOK OKUNANLAR
========================================= */

function cokOkunanlariYukle() {

    const alan = document.querySelector("#cok-okunanlar");

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

function kategoriHaberleriniYukle() {

    const alanlar = document.querySelectorAll("[data-kategori]");

    if (!alanlar.length) return;

    alanlar.forEach(alan => {

        const kategori = alan.dataset.kategori;

        const liste = haberler
            .filter(haber => haber.kategori === kategori)
            .sort((a, b) => {

                const tarihA = new Date(a.tarihISO || 0).getTime();
                const tarihB = new Date(b.tarihISO || 0).getTime();

                return tarihB - tarihA;

            })
            .slice(0, 4);

        alan.innerHTML = liste
            .map(haberKart)
            .join("");

    });
}


/* =========================================
   HERO HABER
========================================= */

function heroHaberYukle() {

    const alan = document.querySelector("#hero-haber");

    if (!alan || !haberler.length) return;

    const hero = [...haberler]
        .sort((a, b) => {

            const tarihA = new Date(a.tarihISO || 0).getTime();
            const tarihB = new Date(b.tarihISO || 0).getTime();

            return tarihB - tarihA;

        })[0];

    if (!hero) return;

    alan.innerHTML = `
        <a
            href="/haberler/${hero.slug}.html"
            class="hero-link"
        >

            <img
                src="${hero.gorsel || '/images/haber.jpg'}"
                alt="${hero.baslik || 'NABIZ Haber'}"
                class="hero-image"
                onerror="this.onerror=null; this.src='/images/haber.jpg';"
            >

            <div class="hero-overlay">

                <h1>
                    ${hero.baslik || ''}
                </h1>

            </div>

        </a>
    `;
}


/* =========================================
   HABER ARAMA
========================================= */

function haberArama() {

    const input = document.querySelector("#haber-arama");

    const sonuc = document.querySelector("#arama-sonuclari");

    if (!input || !sonuc) return;

    function ara() {

        const kelime = input.value
            .trim()
            .toLocaleLowerCase("tr-TR");

        if (!kelime) {

            sonuc.innerHTML = `
                <div class="search-empty">
                    <h3>Haber arayın</h3>
                    <p>
                        Aramak istediğiniz haber başlığını yazın.
                    </p>
                </div>
            `;

            return;
        }

        const bulunanlar = haberler.filter(haber => {

            const baslik = (haber.baslik || "")
                .toLocaleLowerCase("tr-TR");

            const spot = (haber.spot || "")
                .toLocaleLowerCase("tr-TR");

            const kategori = (haber.kategori || "")
                .toLocaleLowerCase("tr-TR");

            return (
                baslik.includes(kelime) ||
                spot.includes(kelime) ||
                kategori.includes(kelime)
            );

        });

        if (!bulunanlar.length) {

            sonuc.innerHTML = `
                <div class="search-empty">
                    <h3>Haber bulunamadı</h3>
                    <p>
                        "${input.value}" için sonuç bulunamadı.
                    </p>
                </div>
            `;

            return;
        }

        sonuc.innerHTML = bulunanlar
            .map(haberKart)
            .join("");
    }

    input.addEventListener("input", ara);

    const form = input.closest("form");

    if (form) {

        form.addEventListener("submit", event => {

            event.preventDefault();

            ara();

        });

    }
}


/* =========================================
   KATEGORİ FİLTRESİ
========================================= */

function kategoriFiltresi() {

    const butonlar =
        document.querySelectorAll("[data-filtre-kategori]");

    const alan =
        document.querySelector("#filtre-sonuclari");

    if (!butonlar.length || !alan) return;

    butonlar.forEach(buton => {

        buton.addEventListener("click", () => {

            const kategori =
                buton.dataset.filtreKategori;

            butonlar.forEach(b => {
                b.classList.remove("active");
            });

            buton.classList.add("active");

            let liste = haberler;

            if (kategori !== "Tümü") {

                liste = haberler.filter(
                    haber => haber.kategori === kategori
                );

            }

            alan.innerHTML = liste
                .map(haberKart)
                .join("");

        });

    });
}


/* =========================================
   HABER SAYFASI İLGİLİ HABERLER
========================================= */

function ilgiliHaberleriYukle() {

    const alan =
        document.querySelector("#related-news-grid");

    if (!alan) return;

    const mevcutSlug =
        document.body.dataset.haberSlug || "";

    const mevcutHaber =
        haberler.find(haber => haber.slug === mevcutSlug);

    let liste = [];

    if (mevcutHaber) {

        liste = haberler
            .filter(haber =>
                haber.slug !== mevcutSlug &&
                haber.kategori === mevcutHaber.kategori
            )
            .slice(0, 4);

    }

    if (!liste.length) {

        liste = haberler
            .filter(haber => haber.slug !== mevcutSlug)
            .slice(0, 4);

    }

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================================
   SAYFA BAŞLAT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    heroHaberYukle();

    sonHaberleriYukle();

    cokOkunanlariYukle();

    kategoriHaberleriniYukle();

    haberArama();

    kategoriFiltresi();

    ilgiliHaberleriYukle();

});
