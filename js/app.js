function haberKart(haber) {

    return `
        <article class="news-card">

            <a href="/haberler/${haber.slug}.html">

                <div class="news-image">

                    <img
                        src="${haber.gorsel}"
                        alt="${haber.baslik}"
                        loading="lazy"
                        decoding="async"
                    >

                </div>


                <div class="news-card-title">

                    <h3>
                        ${haber.baslik}
                    </h3>

                </div>

            </a>

        </article>
    `;

}
