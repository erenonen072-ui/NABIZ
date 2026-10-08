document.addEventListener(
    "DOMContentLoaded",
    () => {

        const haberlerSirali =
            [...haberler]
            .sort(
                (a, b) =>
                    b.id - a.id
            );


        /* TARİH */

        const date =
            document.getElementById(
                "date"
            );

        if (date) {

            date.textContent =
                new Date()
                .toLocaleDateString(
                    "tr-TR",
                    {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    }
                );

        }



        /* SON DAKİKA */

        const breaking =
            document.getElementById(
                "breakingList"
            );

        if (breaking) {

            breaking.innerHTML =
                haberlerSirali
                .filter(
                    h => h.sonDakika
                )
                .map(
                    h => `

                    <a
                        href="haber.html?id=${h.id}"
                    >
                        ${h.baslik}
                    </a>

                `
                )
                .join("");

        }



        /* MANŞET */

        renderHero(
            haberlerSirali
        );



        /* HABERLER */

        renderNews(
            haberlerSirali
        );



        /* ÇOK OKUNANLAR */

        renderPopular();



        /* MOBİL MENÜ */

        const menuButton =
            document.getElementById(
                "menuButton"
            );

        const mobileNav =
            document.getElementById(
                "mobileNav"
            );

        if (
            menuButton &&
            mobileNav
        ) {

            menuButton.addEventListener(
                "click",
                () => {

                    mobileNav.classList.toggle(
                        "open"
                    );

                }
            );

        }



        /* ARAMA */

        setupSearch();

    }
);



/* =========================
   MANŞET
========================= */

function renderHero(
    news
) {

    const hero =
        document.getElementById(
            "hero"
        );

    if (!hero) return;


    const main =
        news.find(
            h => h.manset
        ) || news[0];


    const side =
        news
        .filter(
            h => h.id !== main.id
        )
        .slice(
            0,
            3
        );


    hero.innerHTML = `

        <a
            class="hero-main"
            href="haber.html?id=${main.id}"
        >

            <img
                src="${main.gorsel}"
                alt="${main.baslik}"
            >

            <div class="hero-overlay">

                <span>
                    ${main.kategori}
                </span>

                <h1>
                    ${main.baslik}
                </h1>

                <p>
                    ${main.spot}
                </p>

                <small>
                    ${main.tarih}
                    ·
                    ${main.saat}
                </small>

            </div>

        </a>


        <div class="hero-side">

            ${side.map(
                h => `

                <a
                    class="side-card"
                    href="haber.html?id=${h.id}"
                >

                    <img
                        src="${h.gorsel}"
                        alt="${h.baslik}"
                    >

                    <div>

                        <small>
                            ${h.kategori}
                            ·
                            ${h.saat}
                        </small>

                        <h3>
                            ${h.baslik}
                        </h3>

                    </div>

                </a>

            `
            ).join("")}

        </div>

    `;

}



/* =========================
   HABERLER
========================= */

function renderNews(
    news
) {

    const grid =
        document.getElementById(
            "newsGrid"
        );

    if (!grid) return;


    grid.innerHTML =
        news
        .slice(
            0,
            8
        )
        .map(
            h => `

            <a
                class="news-card"
                href="haber.html?id=${h.id}"
            >

                <div class="news-image">

                    <img
                        src="${h.gorsel}"
                        alt="${h.baslik}"
                        loading="lazy"
                    >

                    <span>
                        ${h.kategori}
                    </span>

                </div>


                <div class="news-content">

                    <small>
                        ${h.tarih}
                        ·
                        ${h.saat}
                    </small>

                    <h3>
                        ${h.baslik}
                    </h3>

                    <p>
                        ${h.spot}
                    </p>

                </div>

            </a>

        `
        )
        .join("");

}



/* =========================
   ÇOK OKUNANLAR
========================= */

function renderPopular() {

    const container =
        document.getElementById(
            "popular"
        );

    if (!container) return;


    const popular =
        [...haberler]
        .sort(
            (a, b) =>
                b.goruntulenme -
                a.goruntulenme
        )
        .slice(
            0,
            5
        );


    container.innerHTML =
        popular
        .map(
            (h, index) => `

            <a
                class="popular-item"
                href="haber.html?id=${h.id}"
            >

                <strong>
                    ${String(
                        index + 1
                    ).padStart(
                        2,
                        "0"
                    )}
                </strong>

                <div>

                    <small>
                        ${h.kategori}
                    </small>

                    <h4>
                        ${h.baslik}
                    </h4>

                </div>

            </a>

        `
        )
        .join("");

}



/* =========================
   ARAMA
========================= */

function setupSearch() {

    const button =
        document.getElementById(
            "searchButton"
        );

    const overlay =
        document.getElementById(
            "searchOverlay"
        );

    const close =
        document.getElementById(
            "closeSearch"
        );

    const input =
        document.getElementById(
            "searchInput"
        );

    const results =
        document.getElementById(
            "searchResults"
        );


    if (!button) return;


    button.addEventListener(
        "click",
        () => {

            overlay.classList.add(
                "open"
            );

            input.focus();

        }
    );


    close.addEventListener(
        "click",
        () => {

            overlay.classList.remove(
                "open"
            );

        }
    );


    input.addEventListener(
        "input",
        () => {

            const query =
                input.value
                .toLocaleLowerCase(
                    "tr-TR"
                )
                .trim();


            if (!query) {

                results.innerHTML =
                    "";

                return;

            }


            const found =
                haberler.filter(
                    h =>

                        `${h.baslik}
                        ${h.spot}
                        ${h.kategori}`
                        .toLocaleLowerCase(
                            "tr-TR"
                        )
                        .includes(
                            query
                        )
                );


            results.innerHTML =
                found.length

                    ? found.map(
                        h => `

                        <a
                            href="haber.html?id=${h.id}"
                        >

                            <img
                                src="${h.gorsel}"
                            >

                            <div>

                                <small>
                                    ${h.kategori}
                                </small>

                                <h3>
                                    ${h.baslik}
                                </h3>

                            </div>

                        </a>

                    `
                    ).join("")

                    :

                    `<p>
                        Haber bulunamadı.
                    </p>`;

        }
    );

}
