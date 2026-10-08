document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    /*
     * TÜM HABERLERİN URL SİSTEMİ
     * Mevcut haber.html?id=1 yapısını kullanır.
     */
    function articleUrl(haber) {
        return `/haber.html?id=${encodeURIComponent(haber.id)}`;
    }


    /*
     * HABER KARTI
     */
    function createCard(haber) {

        return `
            <article class="news-card">

                <a href="${articleUrl(haber)}">

                    <img
                        src="${haber.gorsel}"
                        alt="${haber.baslik}"
                        loading="lazy"
                    >

                    <div class="news-content">

                        <span class="news-category">
                            ${haber.kategori}
                        </span>

                        <h3>
                            ${haber.baslik}
                        </h3>

                        <p>
                            ${haber.spot || ""}
                        </p>

                    </div>

                </a>

            </article>
        `;
    }


    /*
     * KATEGORİLER
     */
    const categories = {

        "Gündem": "gundemNews",

        "Dünya": "dunyaNews",

        "Ekonomi": "ekonomiNews",

        "Spor": "sporNews",

        "Teknoloji": "teknolojiNews",

        "Magazin": "magazinNews"

    };


    /*
     * KATEGORİLERİ DOLDUR
     */
    Object.entries(categories).forEach(
        ([category, elementId]) => {

            const element =
                document.getElementById(elementId);

            if (!element) return;

            const items =
                haberler
                    .filter(
                        haber =>
                            haber.kategori === category
                    )
                    .slice(0, 4);

            if (!items.length) {

                element.innerHTML = `
                    <div
                        style="
                            grid-column:1/-1;
                            background:#fff;
                            border:1px solid #e7e7e7;
                            padding:25px;
                            color:#888;
                            font-size:14px;
                        "
                    >
                        Bu kategoride henüz haber bulunmuyor.
                    </div>
                `;

                return;
            }

            element.innerHTML =
                items
                    .map(createCard)
                    .join("");

        }
    );


    /*
     * SON HABERLER
     */
    const latest =
        document.getElementById("latestNews");

    if (latest) {

        const latestItems =
            haberler.slice(0, 8);

        latest.innerHTML =
            latestItems
                .map(createCard)
                .join("");

    }


    /*
     * HERO
     */
    const hero =
        document.getElementById("hero");

    if (hero && haberler.length) {

        const main =
            haberler[0];

        const side =
            haberler.slice(1, 4);


        hero.innerHTML = `

            <a
                href="${articleUrl(main)}"
                class="hero-main"
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

                </div>

            </a>


            <div class="hero-side">

                ${
                    side.length
                    ?
                    side.map(item => `

                        <a
                            href="${articleUrl(item)}"
                            class="hero-small"
                        >

                            <img
                                src="${item.gorsel}"
                                alt="${item.baslik}"
                            >

                            <div>

                                <span>
                                    ${item.kategori}
                                </span>

                                <h3>
                                    ${item.baslik}
                                </h3>

                            </div>

                        </a>

                    `).join("")
                    :
                    `
                        <div
                            style="
                                background:#111;
                                color:#fff;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                padding:20px;
                                text-align:center;
                            "
                        >
                            NABIZ
                        </div>
                    `
                }

            </div>

        `;

    }


    /*
     * MOBİL MENÜ
     */
    const mobileButton =
        document.getElementById(
            "mobileButton"
        );

    const mobileNav =
        document.getElementById(
            "mobileNav"
        );


    if (
        mobileButton &&
        mobileNav
    ) {

        mobileButton.addEventListener(
            "click",
            () => {

                mobileNav.classList.toggle(
                    "active"
                );

            }
        );

    }

});
