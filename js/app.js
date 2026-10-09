document.addEventListener("DOMContentLoaded", () => {

    const haberler =
        Array.isArray(window.haberler)
            ? window.haberler
            : [];

    /* =====================================================
       HABER BAŞLIĞINDAN URL OLUŞTUR
    ===================================================== */

    function slugify(text) {

        return String(text || "")
            .toLocaleLowerCase("tr-TR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }

    function haberUrl(haber) {

        const slug =
            slugify(haber.baslik);

        return `/haber/${slug}/`;

    }

    function image(haber) {

        return haber.gorsel ||
            "/images/haber11.png";

    }

    function esc(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       20 MANŞET
    ===================================================== */

    const headlines =
        haberler.slice(0, 20);

    const main =
        document.getElementById("headlineMain");

    const nums =
        document.getElementById("headlineNumbers");

    let current = 0;


    function renderHero(index) {

        if (!headlines.length || !main)
            return;

        current = index;

        const haber =
            headlines[index];

        main.innerHTML = `

            <a href="${haberUrl(haber)}">

                <img
                    src="${image(haber)}"
                    alt="${esc(haber.baslik)}"
                >

                <div class="headline-info">

                    <span>
                        ${esc(haber.kategori || "HABER")}
                    </span>

                    <h1>
                        ${esc(haber.baslik)}
                    </h1>

                    ${
                        haber.spot
                            ? `<p>${esc(haber.spot)}</p>`
                            : ""
                    }

                </div>

            </a>

        `;


        if (nums) {

            nums.innerHTML =
                Array.from(
                    { length: 20 },
                    (_, n) => `

                        <button
                            class="headline-number ${
                                n === index
                                    ? "active"
                                    : ""
                            }"
                            data-index="${n}"
                            ${
                                !headlines[n]
                                    ? "disabled"
                                    : ""
                            }
                        >
                            ${n + 1}
                        </button>

                    `
                ).join("");


            nums
                .querySelectorAll("button")
                .forEach(button => {

                    button.onclick = () => {

                        renderHero(
                            Number(
                                button.dataset.index
                            )
                        );

                    };

                });

        }

    }


    renderHero(0);


    /* =====================================================
       MANŞET OTOMATİK DEĞİŞİM
    ===================================================== */

    if (headlines.length > 1) {

        setInterval(() => {

            renderHero(
                (current + 1) %
                headlines.length
            );

        }, 7000);

    }


    /* =====================================================
       SON DAKİKA
    ===================================================== */

    const breaking =
        document.getElementById(
            "breakingScroll"
        );

    if (breaking) {

        breaking.innerHTML =
            haberler
                .slice(0, 8)
                .map(haber => `

                    <a href="${haberUrl(haber)}">
                        ● ${esc(haber.baslik)}
                    </a>

                `)
                .join("");

    }


    /* =====================================================
       HABER KARTI
    ===================================================== */

    function card(haber) {

        return `

            <article class="news-card">

                <a href="${haberUrl(haber)}">

                    <img
                        src="${image(haber)}"
                        alt="${esc(haber.baslik)}"
                        loading="lazy"
                    >

                    <div class="news-card-content">

                        <span class="news-card-category">
                            ${esc(
                                haber.kategori ||
                                "HABER"
                            )}
                        </span>

                        <h3>
                            ${esc(haber.baslik)}
                        </h3>

                        ${
                            haber.spot
                                ? `<p>${esc(haber.spot)}</p>`
                                : ""
                        }

                    </div>

                </a>

            </article>

        `;

    }


    /* =====================================================
       HIZLI HABERLER
    ===================================================== */

    const quick =
        document.getElementById("quickNews");

    if (quick) {

        quick.innerHTML =
            haberler
                .slice(1, 5)
                .map(haber => `

                    <article class="quick-card">

                        <a href="${haberUrl(haber)}">

                            <img
                                src="${image(haber)}"
                                alt="${esc(haber.baslik)}"
                                loading="lazy"
                            >

                            <div class="quick-card-content">

                                <span class="quick-card-category">
                                    ${esc(
                                        haber.kategori ||
                                        "HABER"
                                    )}
                                </span>

                                <h3>
                                    ${esc(haber.baslik)}
                                </h3>

                            </div>

                        </a>

                    </article>

                `)
                .join("");

    }


    /* =====================================================
       SON HABERLER
    ===================================================== */

    const latest =
        document.getElementById(
            "latestNews"
        );

    if (latest) {

        latest.innerHTML =
            haberler
                .slice(0, 9)
                .map(card)
                .join("");

    }


    /* =====================================================
       ÇOK OKUNANLAR
    ===================================================== */

    const popular =
        document.getElementById(
            "popularNews"
        );

    if (popular) {

        const items =
            [...haberler]
                .sort(
                    (a, b) =>
                        (+b.goruntulenme || 0) -
                        (+a.goruntulenme || 0)
                )
                .slice(0, 5);


        popular.innerHTML =
            items
                .map(
                    (haber, index) => `

                        <article class="popular-card">

                            <a
                                href="${haberUrl(haber)}"
                            >

                                <img
                                    src="${image(haber)}"
                                    alt="${esc(haber.baslik)}"
                                    loading="lazy"
                                >

                                <div class="popular-card-content">

                                    <span class="popular-number">
                                        ${String(
                                            index + 1
                                        ).padStart(2, "0")}
                                    </span>

                                    <h3>
                                        ${esc(haber.baslik)}
                                    </h3>

                                </div>

                            </a>

                        </article>

                    `
                )
                .join("");

    }


    /* =====================================================
       KATEGORİLER
    ===================================================== */

    const categories = {

        Gündem: "gundemNews",
        Dünya: "dunyaNews",
        Ekonomi: "ekonomiNews",
        Spor: "sporNews",
        Teknoloji: "teknolojiNews",
        Magazin: "magazinNews"

    };


    Object.entries(categories)
        .forEach(([category, id]) => {

            const element =
                document.getElementById(id);

            if (!element)
                return;


            const categoryNews =
                haberler
                    .filter(
                        haber =>
                            String(
                                haber.kategori || ""
                            ).toLocaleLowerCase("tr-TR")
                            ===
                            category.toLocaleLowerCase("tr-TR")
                    )
                    .slice(0, 4);


            element.innerHTML =
                categoryNews.length

                    ? categoryNews
                        .map(card)
                        .join("")

                    : `
                        <div class="empty">
                            Bu kategoride henüz
                            haber bulunmuyor.
                        </div>
                    `;

        });


    /* =====================================================
       MOBİL MENÜ
    ===================================================== */

    const menu =
        document.getElementById(
            "menuButton"
        );

    const nav =
        document.getElementById(
            "mobileNav"
        );


    if (menu && nav) {

        menu.onclick = () => {

            nav.classList.toggle(
                "active"
            );

        };

    }


    const desktopMenu =
        document.getElementById(
            "desktopMenuButton"
        );


    if (desktopMenu && nav) {

        desktopMenu.onclick = () => {

            nav.classList.toggle(
                "active"
            );

        };

    }


    /* =====================================================
       KARANLIK TEMA
    ===================================================== */

    const theme =
        document.getElementById(
            "themeButton"
        );


    if (
        localStorage.getItem(
            "nabiz-theme"
        ) === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    }


    if (theme) {

        theme.onclick = () => {

            document.body.classList.toggle(
                "dark"
            );

            localStorage.setItem(
                "nabiz-theme",
                document.body.classList.contains(
                    "dark"
                )
                    ? "dark"
                    : "light"
            );

        };

    }

});
