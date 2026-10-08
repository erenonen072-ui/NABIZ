document.addEventListener("DOMContentLoaded", () => {

    const sorted = [...haberler].sort((a, b) => b.id - a.id);

    renderDate();
    renderBreaking(sorted);
    renderHero(sorted);
    renderLatest(sorted);
    renderPopular();
    setupMenu();
    setupSearch();

});


function renderDate() {

    const el = document.getElementById("currentDate");

    if (!el) return;

    const now = new Date();

    el.textContent = now.toLocaleDateString("tr-TR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

}


function renderBreaking(news) {

    const container = document.getElementById("breakingNews");

    if (!container) return;

    const items = news.slice(0, 6);

    container.innerHTML = items.map(haber => `

        <a href="haber.html?id=${haber.id}">
            ${haber.baslik}
        </a>

    `).join("");

}


function renderHero(news) {

    const container = document.getElementById("heroNews");

    if (!container) return;

    const hero = news[0];

    const secondary = news.slice(1, 4);

    container.innerHTML = `

        <a class="hero-main" href="haber.html?id=${hero.id}">

            <img src="${hero.gorsel}" alt="${hero.baslik}">

            <div class="hero-overlay">

                <span class="category">
                    ${hero.kategori}
                </span>

                <h1>
                    ${hero.baslik}
                </h1>

                <p>
                    ${hero.spot}
                </p>

                <div class="hero-meta">
                    ${hero.tarih} · ${hero.saat}
                </div>

            </div>

        </a>


        <div class="hero-side">

            ${secondary.map(haber => `

                <a class="side-card" href="haber.html?id=${haber.id}">

                    <div class="side-image">

                        <img
                            src="${haber.gorsel}"
                            alt="${haber.baslik}"
                        >

                        <span>
                            ${haber.kategori}
                        </span>

                    </div>

                    <div class="side-content">

                        <h3>
                            ${haber.baslik}
                        </h3>

                        <small>
                            ${haber.saat}
                        </small>

                    </div>

                </a>

            `).join("")}

        </div>

    `;

}


function renderLatest(news) {

    const container = document.getElementById("latestNews");

    if (!container) return;

    container.innerHTML = news.slice(0, 8).map(haber => `

        <a class="news-card" href="haber.html?id=${haber.id}">

            <div class="news-image">

                <img
                    src="${haber.gorsel}"
                    alt="${haber.baslik}"
                    loading="lazy"
                >

                <span>
                    ${haber.kategori}
                </span>

            </div>

            <div class="news-card-content">

                <div class="news-time">
                    ${haber.tarih} · ${haber.saat}
                </div>

                <h3>
                    ${haber.baslik}
                </h3>

                <p>
                    ${haber.spot}
                </p>

            </div>

        </a>

    `).join("");

}


function renderPopular() {

    const container = document.getElementById("popularNews");

    if (!container) return;

    const popular = [...haberler]
        .sort((a, b) => b.goruntulenme - a.goruntulenme)
        .slice(0, 5);

    container.innerHTML = popular.map((haber, index) => `

        <a class="popular-item" href="haber.html?id=${haber.id}">

            <strong>
                ${String(index + 1).padStart(2, "0")}
            </strong>

            <div>

                <span>
                    ${haber.kategori}
                </span>

                <h4>
                    ${haber.baslik}
                </h4>

            </div>

        </a>

    `).join("");

}


function setupMenu() {

    const btn = document.getElementById("menuBtn");
    const menu = document.getElementById("mobileMenu");

    if (!btn || !menu) return;

    btn.addEventListener("click", () => {

        menu.classList.toggle("active");

        btn.textContent =
            menu.classList.contains("active")
            ? "×"
            : "☰";

    });

}


function setupSearch() {

    const searchBtn = document.getElementById("searchBtn");
    const overlay = document.getElementById("searchOverlay");
    const closeBtn = document.getElementById("closeSearch");
    const input = document.getElementById("searchInput");
    const results = document.getElementById("searchResults");

    if (!searchBtn) return;

    searchBtn.addEventListener("click", () => {

        overlay.classList.add("active");

        setTimeout(() => input.focus(), 100);

    });


    closeBtn.addEventListener("click", () => {

        overlay.classList.remove("active");

    });


    input.addEventListener("input", () => {

        const value = input.value
            .toLocaleLowerCase("tr-TR")
            .trim();

        if (!value) {

            results.innerHTML = "";

            return;

        }

        const found = haberler.filter(haber =>
            `${haber.baslik} ${haber.spot} ${haber.kategori}`
                .toLocaleLowerCase("tr-TR")
                .includes(value)
        );

        results.innerHTML = found.length

            ? found.map(haber => `

                <a href="haber.html?id=${haber.id}">

                    <img src="${haber.gorsel}">

                    <div>

                        <small>${haber.kategori}</small>

                        <h3>${haber.baslik}</h3>

                    </div>

                </a>

            `).join("")

            : `<p class="no-result">Haber bulunamadı.</p>`;

    });

}
