document.addEventListener("DOMContentLoaded", () => {

    const haberler = Array.isArray(window.haberler)
        ? window.haberler
        : [];


    /* =========================
       HABER URL
    ========================= */

    function articleUrl(haber) {
        return `/haber.html?id=${encodeURIComponent(haber.id)}`;
    }


    /* =========================
       HABER KARTI
    ========================= */

    function createCard(haber) {

        return `
            <article class="news-card">

                <a href="${articleUrl(haber)}">

                    <img
                        src="${haber.gorsel || ""}"
                        alt="${haber.baslik || ""}"
                        loading="lazy"
                    >

                    <div class="news-content">

                        <span class="news-category">
                            ${haber.kategori || "HABER"}
                        </span>

                        <h3>
                            ${haber.baslik || ""}
                        </h3>

                        ${
                            haber.spot
                                ? `<p>${haber.spot}</p>`
                                : ""
                        }

                    </div>

                </a>

            </article>
        `;
    }


    /* =========================
       HERO
    ========================= */

    const hero =
        document.getElementById("hero");

    if (hero && haberler.length > 0) {

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
                        ? side.map(item => `

                            <a
                                href="${articleUrl(item)}"
                                class="hero-small"
                            >

                                <img
                                    src="${item.gorsel}"
                                    alt="${item.baslik}"
                                    loading="lazy"
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
                                    font-weight:800;
                                "
                            >
                                NABIZ
                            </div>
                        `
                }

            </div>
        `;
    }


    /* =========================
       SON HABERLER
    ========================= */

    const latest =
        document.getElementById("latestNews");

    if (latest) {

        latest.innerHTML =
            haberler
                .slice(0, 6)
                .map(createCard)
                .join("");

    }


    /* =========================
       KATEGORİLER
    ========================= */

    const categories = {

        Gündem: "gundemNews",

        Dünya: "dunyaNews",

        Ekonomi: "ekonomiNews",

        Spor: "sporNews",

        Teknoloji: "teknolojiNews",

        Magazin: "magazinNews"

    };


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
                            border:1px solid #ddd;
                            padding:25px;
                            color:#888;
                            font-size:13px;
                        "
                    >
                        Bu kategoride henüz haber bulunmuyor.
                    </div>
                `;

            } else {

                element.innerHTML =
                    items
                        .map(createCard)
                        .join("");

            }

        }
    );


    /* =========================
       MOBİL MENÜ
    ========================= */

    const mobileButton =
        document.getElementById("mobileButton");

    const mobileNav =
        document.getElementById("mobileNav");


    if (mobileButton && mobileNav) {

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
