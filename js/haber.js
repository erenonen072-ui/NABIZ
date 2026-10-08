document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    const path =
        window.location.pathname
            .split("/")
            .filter(Boolean);

    const current =
        path[path.length - 1];

    const haber =
        haberler.find(item => {

            const slug = item.baslik
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

            return `${item.id}-${slug}` === current;

        });


    const content =
        document.getElementById("articleContent");

    if (!haber) {

        content.innerHTML = `
            <h1>Haber bulunamadı</h1>
            <p>
                Aradığınız haber mevcut değil.
            </p>
            <a href="/">Ana sayfaya dön</a>
        `;

        return;

    }


    document.title =
        `${haber.baslik} | NABIZ`;


    content.innerHTML = `

        <div class="article-category">
            ${haber.kategori}
        </div>

        <h1 class="article-title">
            ${haber.baslik}
        </h1>

        <p class="article-spot">
            ${haber.spot}
        </p>

        <div class="article-meta">

            <span>${haber.tarih}</span>

            <span>${haber.kaynak}</span>

        </div>

        <img
            class="article-image"
            src="${haber.gorsel}"
            alt="${haber.baslik}"
        >

        <div class="article-text">
            ${haber.icerik}
        </div>

    `;


    const url =
        window.location.href;

    const encodedUrl =
        encodeURIComponent(url);

    const encodedTitle =
        encodeURIComponent(haber.baslik);


    document.getElementById("whatsappShare").href =
        `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

    document.getElementById("xShare").href =
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;


    document.getElementById("copyShare")
        .addEventListener("click", async () => {

            await navigator.clipboard.writeText(url);

            const button =
                document.getElementById("copyShare");

            button.textContent = "Kopyalandı ✓";

            setTimeout(() => {
                button.textContent = "Linki Kopyala";
            }, 2000);

        });


    document.getElementById("nativeShare")
        .addEventListener("click", async () => {

            if (navigator.share) {

                await navigator.share({
                    title: haber.baslik,
                    text: haber.spot,
                    url: url
                });

            }

        });

});
