document.addEventListener("DOMContentLoaded", () => {

    const haberler =
        Array.isArray(window.haberler)
            ? window.haberler
            : [];


    function articleUrl(haber){

        return `/haber.html?id=${encodeURIComponent(haber.id)}`;

    }


    function newsCard(haber){

        return `
            <article class="news-card">

                <a href="${articleUrl(haber)}">

                    <img
                        src="${haber.gorsel || ""}"
                        alt="${haber.baslik || ""}"
                        loading="lazy"
                    >

                    <div class="news-card-content">

                        <span class="news-card-category">
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
       20'Lİ MANŞET
    ========================= */

    const headlineMain =
        document.getElementById("headlineMain");

    const headlineSide =
        document.getElementById("headlineSide");

    const headlineNumbers =
        document.getElementById("headlineNumbers");


    const headlines =
        haberler.slice(0,20);


    function showHeadline(index){

        if(!headlines.length) return;

        const main =
            headlines[index];

        const side =
            headlines[
                (index + 1) % headlines.length
            ];


        headlineMain.innerHTML = `

            <a href="${articleUrl(main)}">

                <img
                    src="${main.gorsel || ""}"
                    alt="${main.baslik || ""}"
                >

                <div class="headline-info">

                    <span>
                        ${main.kategori || "HABER"}
                    </span>

                    <h1>
                        ${main.baslik || ""}
                    </h1>

                </div>

            </a>

        `;


        headlineSide.innerHTML = `

            <a href="${articleUrl(side)}">

                <img
                    src="${side.gorsel || ""}"
                    alt="${side.baslik || ""}"
                >

                <div class="side-info">

                    <span>
                        ${side.kategori || "HABER"}
                    </span>

                    <h2>
                        ${side.baslik || ""}
                    </h2>

                </div>

            </a>

        `;


        headlineNumbers.innerHTML =
            Array.from(
                {length:20},
                (_,i) => `

                    <button
                        class="headline-number ${
                            i === index
                                ? "active"
                                : ""
                        }"
                        data-index="${i}"
                        ${!headlines[i] ? "disabled" : ""}
                    >
                        ${i + 1}
                    </button>

                `
            ).join("");


        document
            .querySelectorAll(".headline-number")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        showHeadline(
                            Number(button.dataset.index)
                        );

                    }
                );

            });

    }


    if(headlines.length){

        showHeadline(0);

    }



    /* =========================
       MANŞET ALTI 4 HABER
    ========================= */

    const quick =
        document.getElementById("quickNews");


    if(quick){

        quick.innerHTML =
            haberler
                .slice(1,5)
                .map(haber => `

                    <article class="quick-card">

                        <a href="${articleUrl(haber)}">

                            <img
                                src="${haber.gorsel || ""}"
                                alt="${haber.baslik || ""}"
                                loading="lazy"
                            >

                            <div class="quick-card-content">

                                <span class="quick-card-category">
                                    ${haber.kategori || "HABER"}
                                </span>

                                <h3>
                                    ${haber.baslik || ""}
                                </h3>

                            </div>

                        </a>

                    </article>

                `)
                .join("");

    }



    /* =========================
       SON HABERLER
    ========================= */

    const latest =
        document.getElementById("latestNews");


    if(latest){

        latest.innerHTML =
            haberler
                .slice(0,9)
                .map(newsCard)
                .join("");

    }



    /* =========================
       ÇOK OKUNANLAR
    ========================= */

    const popular =
        document.getElementById("popularNews");


    if(popular){

        const popularItems =
            [...haberler]
                .sort(
                    (a,b) =>
                        (Number(b.goruntulenme) || 0) -
                        (Number(a.goruntulenme) || 0)
                )
                .slice(0,5);


        const items =
            popularItems.length
                ? popularItems
                : haberler.slice(0,5);


        popular.innerHTML =
            items.map(
                (haber,index) => `

                    <article class="popular-card">

                        <a href="${articleUrl(haber)}">

                            <img
                                src="${haber.gorsel || ""}"
                                alt="${haber.baslik || ""}"
                                loading="lazy"
                            >

                            <div class="popular-card-content">

                                <span class="popular-number">
                                    ${String(index+1).padStart(2,"0")}
                                </span>

                                <h3>
                                    ${haber.baslik || ""}
                                </h3>

                            </div>

                        </a>

                    </article>

                `
            ).join("");

    }



    /* =========================
       KATEGORİLER
    ========================= */

    const categories = {

        "Gündem":"gundemNews",

        "Dünya":"dunyaNews",

        "Ekonomi":"ekonomiNews",

        "Spor":"sporNews",

        "Teknoloji":"teknolojiNews",

        "Magazin":"magazinNews"

    };


    Object.entries(categories)
        .forEach(
            ([category,id]) => {

                const element =
                    document.getElementById(id);

                if(!element) return;


                const items =
                    haberler
                        .filter(
                            haber =>
                                haber.kategori === category
                        )
                        .slice(0,4);


                element.innerHTML =
                    items.length
                        ? items.map(newsCard).join("")
                        : `
                            <div style="
                                background:#fff;
                                border:1px solid #ddd;
                                padding:25px;
                                color:#777;
                                grid-column:1/-1
                            ">
                                Bu kategoride henüz haber
                                bulunmuyor.
                            </div>
                        `;

            }
        );



    /* =========================
       MOBİL MENÜ
    ========================= */

    const menuButton =
        document.getElementById("menuButton");

    const mobileNav =
        document.getElementById("mobileNav");


    if(menuButton && mobileNav){

        menuButton.addEventListener(
            "click",
            () => {

                mobileNav.classList.toggle("active");

            }
        );

    }

});
