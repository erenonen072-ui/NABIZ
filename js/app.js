document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    const map = {
        "Gündem": "gundemNews",
        "Dünya": "dunyaNews",
        "Ekonomi": "ekonomiNews",
        "Spor": "sporNews",
        "Teknoloji": "teknolojiNews",
        "Magazin": "magazinNews"
    };


    function slugify(text) {

        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    function getUrl(haber) {

        if (haber.url) {
            return haber.url;
        }

        return `/haber/${haber.id}-${slugify(haber.baslik)}/`;

    }


    function haberCard(haber) {

        return `
            <article class="news-card">

                <a href="${getUrl(haber)}">

                    <div class="news-image">

                        <img
                            src="${haber.gorsel}"
                            alt="${haber.baslik}"
                            loading="lazy"
                        >

                    </div>

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


    function renderCategory(category) {

        const containerId = map[category];

        const container = document.getElementById(containerId);

        if (!container) return;

        const news = haberler
            .filter(h => h.kategori === category)
            .slice(0, 4);

        container.innerHTML = news
            .map(haberCard)
            .join("");

    }


    Object.keys(map).forEach(renderCategory);


    // MANŞET

    const heroMain = document.getElementById("heroMain");
    const heroSide = document.getElementById("heroSide");

    const featured = haberler.slice(0, 5);

    if (featured.length && heroMain) {

        const main = featured[0];

        heroMain.innerHTML = `
            <a href="${getUrl(main)}" class="hero-card">

                <img
                    src="${main.gorsel}"
                    alt="${main.baslik}"
                >

                <div class="hero-overlay">

                    <span>${main.kategori}</span>

                    <h1>
                        ${main.baslik}
                    </h1>

                    <p>
                        ${main.spot || ""}
                    </p>

                </div>

            </a>
        `;

    }


    if (heroSide) {

        heroSide.innerHTML = featured
            .slice(1, 5)
            .map(haber => `

                <a href="${getUrl(haber)}" class="hero-small">

                    <img
                        src="${haber.gorsel}"
                        alt="${haber.baslik}"
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

            `)
            .join("");

    }


    // MOBİL MENÜ

    const mobileButton =
        document.getElementById("mobileMenuButton");

    const mobileMenu =
        document.getElementById("mobileMenu");


    if (mobileButton && mobileMenu) {

        mobileButton.addEventListener("click", () => {

            mobileMenu.classList.toggle("active");

        });

    }

});
