document.addEventListener("DOMContentLoaded", () => {

    const haberler = Array.isArray(window.haberler)
        ? window.haberler
        : [];


    function articleUrl(haber) {
        return `/haber.html?id=${encodeURIComponent(haber.id)}`;
    }


    function card(haber) {

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


    /* HERO */

    const hero = document.getElementById("hero");

    if (hero && haberler.length) {

        const main = haberler[0];

        const side = haberler.slice(1, 4);

        hero.innerHTML = `

            <a
                class="hero-main"
                href="${articleUrl(main)}"
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
                    ? side.map(haber => `

                        <a
                            class="hero-small"
                            href="${articleUrl(haber)}"
                        >

                            <img
                                src="${haber.gorsel}"
                                alt="${haber.baslik}"
                                loading="lazy"
                            >

                            <div>

                                <span>
                                    ${haber.kategori}
                                </span>

                                <h3>
                                    ${haber.baslik}
                                </h3>

                            </div>

                        </a>

                    `).join("")
                    :
                    `
                        <div class="hero-small">
                            <div>
                                <h3>
                                    NABIZ
                                </h3>
                            </div>
                        </div>

                        <div class="hero-small">
                            <div>
                                <h3>
                                    Güncel haberler
                                </h3>
                            </div>
                        </div>

                        <div class="hero-small">
                            <div>
                                <h3>
                                    NABIZ'ı takip edin
                                </h3>
                            </div>
                        </div>
                    `
                }

            </div>
        `;
    }


    /* SON HABERLER */

    const latest =
        document.getElementById("latestNews");

    if (latest) {

        latest.innerHTML = haberler
            .slice(0, 6)
            .map(card)
            .join("");

    }


    /* KATEGORİLER */

    const categories = {

        "Gündem": "gundemNews",

        "Dünya": "dunyaNews",

        "Ekonomi": "ekonomiNews",

        "Spor": "sporNews",

        "Teknoloji": "teknolojiNews",

        "Magazin": "magazinNews"

    };


    Object.entries(categories).forEach(
        ([category, id]) => {

            const element =
                document.getElementById(id);

            if (!element) return;


            const items = haberler
                .filter(
                    haber =>
                        haber.kategori === category
                )
                .slice(0, 4);


            if (!items.length) {

                element.innerHTML = `
                    <div style="
                        grid-column:1/-1;
                        background:white;
                        border:1px solid #ddd;
                        padding:25px;
                        color:#888;
                        font-size:12px;
                    ">
                        Bu kategoride henüz haber bulunmuyor.
                    </div>
                `;

                return;
            }


            element.innerHTML =
                items.map(card).join("");

        }
    );


    /* MOBİL MENÜ */

    const button =
        document.getElementById("mobileButton");

    const mobile =
        document.getElementById("mobileNav");


    if (button && mobile) {

        button.addEventListener("click", () => {

            mobile.classList.toggle("active");

        });

    }

});
