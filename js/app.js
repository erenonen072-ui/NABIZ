const haberler = window.NABIZ_HABERLER || [];

let aktifHero = 0;


/* =====================================================
   HABER URL
===================================================== */

function haberURL(haber) {

    return `/haberler/${haber.slug}.html`;

}


/* =====================================================
   KART
===================================================== */

function haberKart(haber) {

    return `

        <article class="news-card">

            <a
                href="${haberURL(haber)}"
                class="news-card-link"
            >

                <div class="news-image">

                    <img
                        src="${haber.gorsel}"
                        alt="${haber.baslik}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.src='/images/default.jpg'"
                    >

                    <span class="image-category">
                        ${haber.kategori}
                    </span>

                </div>


                <div class="news-card-body">

                    <h3>
                        ${haber.baslik}
                    </h3>

                    <p>
                        ${haber.spot}
                    </p>


                    <div class="news-card-meta">

                        <time>
                            ${haber.saat}
                        </time>

                        <span>
                            ${haber.kategori}
                        </span>

                    </div>

                </div>

            </a>

        </article>

    `;

}


/* =====================================================
   HERO
===================================================== */

function heroOlustur(index) {

    const haber = haberler[index];

    if (!haber) return;


    document.getElementById("hero").innerHTML = `

        <article class="hero-card">

            <a href="${haberURL(haber)}">

                <div class="hero-image">

                    <img
                        src="${haber.gorsel}"
                        alt="${haber.baslik}"
                        fetchpriority="high"
                        decoding="async"
                        onerror="this.src='/images/default.jpg'"
                    >

                </div>


                <div class="hero-content">

                    <span class="hero-category">
                        ${haber.kategori}
                    </span>


                    <h1>
                        ${haber.baslik}
                    </h1>


                    <p>
                        ${haber.spot}
                    </p>


                    <span class="hero-read">
                        Haberi Oku →
                    </span>

                </div>

            </a>

        </article>

    `;


    document
        .querySelectorAll(".hero-page")
        .forEach((button, buttonIndex) => {

            button.classList.toggle(
                "active",
                buttonIndex === index
            );

        });

}


/* =====================================================
   1-20 MANŞET
===================================================== */

function heroPaginationOlustur() {

    const container =
        document.getElementById("heroPagination");

    container.innerHTML = haberler
        .slice(0, 20)
        .map((haber, index) => `

            <button
                class="hero-page ${index === 0 ? "active" : ""}"
                type="button"
                data-index="${index}"
            >
                ${index + 1}
            </button>

        `)
        .join("");


    container
        .querySelectorAll(".hero-page")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    aktifHero =
                        Number(button.dataset.index);

                    heroOlustur(aktifHero);

                }
            );

        });

}


/* =====================================================
   SON DAKİKA
===================================================== */

function breakingOlustur() {

    document.getElementById("breakingNews").innerHTML =

        haberler
            .slice(0, 8)
            .map(haber => `

                <a href="${haberURL(haber)}">

                    ${haber.baslik}

                </a>

            `)
            .join("");

}


/* =====================================================
   SON HABERLER
===================================================== */

function sonHaberler() {

    document.getElementById("latestNews").innerHTML =

        haberler
            .slice(0, 8)
            .map(haberKart)
            .join("");

}


/* =====================================================
   GÜNDEM
===================================================== */

function kategoriHaberleri(
    elementId,
    kategori,
    limit = 4
) {

    const container =
        document.getElementById(elementId);

    if (!container) return;


    const liste = haberler

        .filter(haber =>
            haber.kategori === kategori
        )

        .slice(0, limit);


    container.innerHTML =
        liste.map(haberKart).join("");

}


/* =====================================================
   ÇOK OKUNAN
===================================================== */

function cokOkunanlar() {

    const container =
        document.getElementById("popularNews");


    const liste = [...haberler]

        .sort(
            (a, b) =>
                b.goruntulenme -
                a.goruntulenme
        )

        .slice(0, 7);


    container.innerHTML = liste

        .map((haber, index) => `

            <a
                href="${haberURL(haber)}"
                class="popular-item"
            >

                <span class="popular-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>


                <div class="popular-content">

                    <span>
                        ${haber.kategori}
                    </span>

                    <h3>
                        ${haber.baslik}
                    </h3>

                </div>

            </a>

        `)

        .join("");

}


/* =====================================================
   ARAMA
===================================================== */

function arama() {

    const input =
        document.getElementById("searchInput");

    const results =
        document.getElementById("searchResults");


    const query =
        input.value
            .trim()
            .toLocaleLowerCase("tr-TR");


    if (!query) {

        results.innerHTML = "";

        return;

    }


    const bulunanlar = haberler.filter(haber =>

        haber.baslik
            .toLocaleLowerCase("tr-TR")
            .includes(query)

        ||

        haber.spot
            .toLocaleLowerCase("tr-TR")
            .includes(query)

    );


    if (!bulunanlar.length) {

        results.innerHTML = `
            <div class="search-empty">
                Haber bulunamadı.
            </div>
        `;

        return;

    }


    results.innerHTML = bulunanlar

        .map(haber => `

            <a
                href="${haberURL(haber)}"
                class="search-result"
            >

                <strong>
                    ${haber.baslik}
                </strong>

                <small>
                    ${haber.kategori} • ${haber.tarih}
                </small>

            </a>

        `)

        .join("");

}


/* =====================================================
   TEMA
===================================================== */

function tema() {

    document.body.classList.toggle("dark-mode");

    localStorage.setItem(
        "nabiz-theme",
        document.body.classList.contains("dark-mode")
            ? "dark"
            : "light"
    );

}


function temaYukle() {

    if (
        localStorage.getItem("nabiz-theme") === "dark"
    ) {

        document.body.classList.add("dark-mode");

    }

}


/* =====================================================
   BAŞLAT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        temaYukle();

        breakingOlustur();

        heroPaginationOlustur();

        heroOlustur(0);

        sonHaberler();

        kategoriHaberleri(
            "gundemNews",
            "Gündem",
            4
        );

        kategoriHaberleri(
            "ekonomiNews",
            "Ekonomi",
            4
        );

        kategoriHaberleri(
            "sporNews",
            "Spor",
            4
        );

        kategoriHaberleri(
            "dunyaNews",
            "Dünya",
            4
        );

        kategoriHaberleri(
            "teknolojiNews",
            "Teknoloji",
            4
        );

        cokOkunanlar();


        document
            .getElementById("themeButton")
            ?.addEventListener(
                "click",
                tema
            );


        document
            .getElementById("searchButton")
            ?.addEventListener(
                "click",
                () => {

                    document
                        .getElementById("searchPanel")
                        .classList.toggle("open");

                }
            );


        document
            .getElementById("searchInput")
            ?.addEventListener(
                "input",
                arama
            );


        document
            .getElementById("mobileMenuButton")
            ?.addEventListener(
                "click",
                () => {

                    document
                        .getElementById("navigation")
                        .classList.toggle("mobile-open");

                }
            );

    }
);
