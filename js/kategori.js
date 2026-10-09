(() => {
    "use strict";

    const body = document.body;

    const isSearch =
        body.dataset.searchPage === "true";

    const category =
        body.dataset.category || "";

    const $ = id =>
        document.getElementById(id);

    const clean = value =>
        String(value ?? "").trim();

    const normalize = value =>
        clean(value)
            .toLocaleLowerCase("tr-TR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ı/g, "i");

    const esc = value =>
        clean(value).replace(
            /[&<>"']/g,
            char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[char])
        );

    const fallback =
        "/images/haber.jpg";

    const allNews =
        Array.isArray(window.NABIZ_HABERLER)
            ? window.NABIZ_HABERLER
            : [];

    const title = haber =>
        clean(
            haber.baslik ||
            haber.title ||
            haber.headline ||
            "Başlıksız haber"
        );

    const categoryName = haber =>
        clean(
            haber.kategori ||
            haber.category ||
            haber.kategoriAdi
        );

    const image = haber =>
        clean(
            haber.gorsel ||
            haber.gorselUrl ||
            haber.image ||
            haber.resim
        ) || fallback;

    const articleUrl = haber => {
        if (haber.url) {
            return haber.url;
        }

        if (haber.slug) {
            return `/haberler/${haber.slug}.html`;
        }

        return "#";
    };

    const card = haber => `
        <a
            class="kn-news-card"
            href="${esc(articleUrl(haber))}"
        >
            <img
                src="${esc(image(haber))}"
                alt="${esc(title(haber))}"
                loading="lazy"
                onerror="this.onerror=null;this.src='/images/haber.jpg';"
            >

            <h3>
                ${esc(title(haber))}
            </h3>
        </a>
    `;

    const featureMain = haber => `
        <a
            class="kn-feature-main"
            href="${esc(articleUrl(haber))}"
        >
            <img
                src="${esc(image(haber))}"
                alt="${esc(title(haber))}"
                fetchpriority="high"
                onerror="this.onerror=null;this.src='/images/haber.jpg';"
            >

            <h3>
                ${esc(title(haber))}
            </h3>
        </a>
    `;

    const featureSide = haber => `
        <a
            class="kn-feature-side"
            href="${esc(articleUrl(haber))}"
        >
            <img
                src="${esc(image(haber))}"
                alt="${esc(title(haber))}"
                loading="lazy"
                onerror="this.onerror=null;this.src='/images/haber.jpg';"
            >

            <h3>
                ${esc(title(haber))}
            </h3>
        </a>
    `;

    const featured =
        $("knFeatured");

    const grid =
        $("knNewsGrid");

    const empty =
        $("knEmpty");

    const pagination =
        $("knPagination");

    const count =
        $("knCount");

    let page = 1;

    const perPage = 12;

    let results = [];

    function sortNews(list) {
        return [...list].sort((a, b) => {
            return (
                new Date(
                    b.tarihISO || 0
                ) -
                new Date(
                    a.tarihISO || 0
                )
            );
        });
    }

    function renderFeatured(list) {

        const section =
            $("knFeaturedSection");

        if (!section || !featured) {
            return;
        }

        if (!list.length) {
            section.hidden = true;
            featured.innerHTML = "";
            return;
        }

        section.hidden = false;

        featured.innerHTML = `
            ${featureMain(list[0])}

            <div class="kn-feature-side-wrap">
                ${list
                    .slice(1, 5)
                    .map(featureSide)
                    .join("")}
            </div>
        `;
    }

    function renderPagination() {

        if (!pagination) {
            return;
        }

        pagination.innerHTML = "";

        const totalPages =
            Math.ceil(
                results.length / perPage
            );

        if (totalPages <= 1) {
            return;
        }

        for (
            let i = 1;
            i <= totalPages;
            i++
        ) {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "kn-page-btn" +
                (i === page
                    ? " is-current"
                    : "");

            button.textContent = i;

            button.setAttribute(
                "aria-label",
                `${i}. sayfa`
            );

            if (i === page) {
                button.setAttribute(
                    "aria-current",
                    "page"
                );
            }

            button.addEventListener(
                "click",
                () => {

                    page = i;

                    render();

                    document
                        .querySelector(
                            ".kn-list-section"
                        )
                        ?.scrollIntoView({
                            behavior: "smooth"
                        });
                }
            );

            pagination.appendChild(button);
        }
    }

    function render() {

        if (!grid) {
            return;
        }

        const start =
            (page - 1) * perPage;

        const visible =
            results.slice(
                start,
                start + perPage
            );

        grid.innerHTML =
            visible
                .map(card)
                .join("");

        if (empty) {
            empty.hidden =
                results.length !== 0;
        }

        grid.hidden =
            results.length === 0;

        if (count) {
            count.textContent =
                results.length
                    ? `${results.length} haber`
                    : "";
        }

        renderPagination();
    }

    /* KATEGORİ SAYFASI */

    if (!isSearch) {

        const categoryNews =
            allNews.filter(haber =>
                normalize(
                    categoryName(haber)
                ) === normalize(category)
            );

        results =
            sortNews(categoryNews)
                .slice(4);

        renderFeatured(
            sortNews(categoryNews)
        );

        render();

        if (
            !categoryNews.length &&
            empty
        ) {

            const strong =
                empty.querySelector("strong");

            const paragraph =
                empty.querySelector("p");

            if (strong) {
                strong.textContent =
                    `${category} kategorisinde henüz haber bulunmuyor.`;
            }

            if (paragraph) {
                paragraph.textContent =
                    "Bu kategoriye haber eklendiğinde burada otomatik olarak görünecek.";
            }
        }
    }

    /* ARAMA SAYFASI */

    if (isSearch) {

        const input =
            $("knSearchInput");

        const status =
            $("knSearchStatus");

        function search() {

            const query =
                normalize(
                    input?.value || ""
                );

            if (!query) {

                results = [];

                renderFeatured([]);

                if (status) {
                    status.textContent =
                        "Aramak için bir kelime yazın.";
                }

                render();

                return;
            }

            results =
                sortNews(
                    allNews.filter(haber => {

                        const text = [
                            title(haber),
                            haber.spot,
                            haber.kategori,
                            haber.kaynak,
                            Array.isArray(haber.icerik)
                                ? haber.icerik.join(" ")
                                : haber.icerik
                        ]
                            .join(" ");

                        return normalize(text)
                            .includes(query);
                    })
                );

            page = 1;

            renderFeatured(results);

            const listTitle =
                $("knListTitle");

            if (listTitle) {
                listTitle.textContent =
                    `"${clean(input.value)}" arama sonuçları`;
            }

            if (status) {
                status.textContent =
                    `${results.length} sonuç bulundu.`;
            }

            render();
        }

        input?.addEventListener(
            "input",
            search
        );

        $("knSearchClear")
            ?.addEventListener(
                "click",
                () => {

                    if (input) {
                        input.value = "";
                        input.focus();
                    }

                    search();
                }
            );

        renderFeatured([]);

        render();
    }

    /* MOBİL MENÜ */

    const menuButton =
        $("knMenuButton");

    const nav =
        $("knNavLinks");

    menuButton?.addEventListener(
        "click",
        () => {

            const open =
                nav.classList.toggle(
                    "kn-open"
                );

            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );
        }
    );

    /* TEMA */

    const themeButton =
        $("knTheme");

    try {
        if (
            localStorage.getItem(
                "nabiz-theme"
            ) === "dark"
        ) {
            body.classList.add(
                "kn-dark"
            );
        }
    } catch (error) {}

    function updateThemeButton() {

        if (!themeButton) {
            return;
        }

        themeButton.setAttribute(
            "aria-pressed",
            String(
                body.classList.contains(
                    "kn-dark"
                )
            )
        );
    }

    updateThemeButton();

    themeButton?.addEventListener(
        "click",
        () => {

            body.classList.toggle(
                "kn-dark"
            );

            try {
                localStorage.setItem(
                    "nabiz-theme",
                    body.classList.contains(
                        "kn-dark"
                    )
                        ? "dark"
                        : "light"
                );
            } catch (error) {}

            updateThemeButton();
        }
    );

})();
