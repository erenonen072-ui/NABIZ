document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(location.search);

    const id = Number(params.get("id"));

    const haber = haberler.find(h => h.id === id);

    const container = document.getElementById("article");

    if (!haber) {

        container.innerHTML = `

            <div class="not-found">

                <h1>Haber bulunamadı</h1>

                <a href="index.html">
                    Ana sayfaya dön
                </a>

            </div>

        `;

        return;

    }


    document.title = `${haber.baslik} | NABIZ`;


    container.innerHTML = `

        <article class="article">

            <div class="article-category">
                ${haber.kategori}
            </div>

            <h1>
                ${haber.baslik}
            </h1>

            <p class="article-spot">
                ${haber.spot}
            </p>

            <div class="article-meta">

                <span>
                    ${haber.tarih} ${haber.saat}
                </span>

                <span>
                    ${haber.yazar}
                </span>

                <span>
                    Kaynak: ${haber.kaynak}
                </span>

            </div>

            <img
                class="article-image"
                src="${haber.gorsel}"
                alt="${haber.baslik}"
            >

            <div class="article-body">

                ${haber.icerik
                    .trim()
                    .split(/\n+/)
                    .map(p => `<p>${p}</p>`)
                    .join("")
                }

            </div>

        </article>

    `;

});
