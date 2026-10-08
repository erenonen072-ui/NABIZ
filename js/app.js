document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    const categories = {
        "Gündem": "gundemNews",
        "Dünya": "dunyaNews",
        "Ekonomi": "ekonomiNews",
        "Spor": "sporNews",
        "Teknoloji": "teknolojiNews",
        "Magazin": "magazinNews"
    };

    // Haber detay sayfası
    function articleUrl(haber) {
        return `/haber.html?id=${haber.id}`;
    }

    // Haber kartı
    function card(haber) {
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
                            ${haber.spot}
                        </p>

                    </div>

                </a>
            </article>
        `;
    }

    // Kategori haberlerini oluştur
    for (const category in categories) {

        const element =
            document.getElementById(
                categories[category]
            );

        if (!element) continue;

        const items = haberler
            .filter(
                haber => haber.kategori === category
            )
            .slice(0, 4);

        element.innerHTML =
            items.map(card).join("");
    }

    // HERO
    const hero =
        document.getElementById("hero");

    if (hero && haberler.length) {

        const main = haberler[0];

        const side =
            haberler.slice(1, 4);

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

                ${side.map(item => `

                    <a
                        class="hero-small"
                        href="${articleUrl(item)}"
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

                `).join("")}

            </div>
        `;
    }

    // Mobil menü
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
