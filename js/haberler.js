const haberler = window.NABIZ_HABERLER || [];

/* =========================
   HABER KARTI
========================= */

function haberKart(haber) {
    return `
        <article class="news-card">
            <a href="/haberler/${haber.slug}.html">
                <div class="news-image">
                    <img
                        src="${haber.gorsel || '/images/haber.jpg'}"
                        alt="${haber.baslik}"
                        loading="lazy"
                        decoding="async"
                    >
                </div>

                <div class="news-card-title">
                    <h3>${haber.baslik}</h3>
                </div>
            </a>
        </article>
    `;
}


/* =========================
   SON HABERLER
========================= */

function sonHaberleriYukle() {
    const alan = document.querySelector("#son-haberler");

    if (!alan) return;

    const liste = [...haberler]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================
   ÇOK OKUNANLAR
========================= */

function cokOkunanlariYukle() {
    const alan = document.querySelector("#cok-okunanlar");

    if (!alan) return;

    const liste = [...haberler]
        .sort((a, b) => (b.goruntulenme || 0) - (a.goruntulenme || 0))
        .slice(0, 5);

    alan.innerHTML = liste
        .map(haberKart)
        .join("");
}


/* =========================
   SAYFA AÇILINCA
========================= */

document.addEventListener("DOMContentLoaded", () => {
    sonHaberleriYukle();
    cokOkunanlariYukle();
});
