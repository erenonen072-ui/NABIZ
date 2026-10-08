document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    const path = window.location.pathname;

    const parts = path
        .split("/")
        .filter(Boolean);

    const slug = parts[parts.length - 1];

    if (!slug) return;


    const haber = haberler.find(haber => {

        const generatedSlug = haber.baslik
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

        return `${haber.id}-${generatedSlug}` === slug;

    });


    const container =
        document.getElementById("articleContent");


    if (!haber) {

        container.innerHTML = `
            <div class="not-found">

                <h1>Haber bulunamadı</h1>

                <a href="/">
                    Ana sayfaya dön
                </a>

            </div>
        `;

        return;

    }


    document.title =
        `${haber.baslik} | NABIZ`;


    container.innerHTML = `

        <div class="article-category">
            ${haber.kategori}
        </div>

        <h1 class="article-title">
            ${haber.baslik}
        </h1>

        <p class="article-spot">
            ${haber.spot || ""}
        </p>

        <div class="article-meta">

            <span>
                ${haber.tarih || ""}
            </span>

            <span>
                ${haber.kaynak || "NABIZ"}
            </span>

        </div>

        <img
            class="article-image"
            src="${haber.gorsel}"
            alt="${haber.baslik}"
        >

        <div class="article-text">

            ${haber.icerik || ""}

        </div>

    `;


    const currentUrl =
        window.location.href;


    const encodedUrl =
        encodeURIComponent(currentUrl);

    const encodedTitle =
        encodeURIComponent(haber.baslik);


    const whatsapp =
        document.getElementById("whatsappShare");

    const x =
        document.getElementById("xShare");

    const copy =
        document.getElementById("copyShare");

    const native =
        document.getElementById("nativeShare");


    whatsapp.href =
        `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;


    x.href =
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;


    copy.addEventListener("click", async () => {

        await navigator.clipboard.writeText(currentUrl);

        copy.textContent = "Kopyalandı ✓";

        setTimeout(() => {

            copy.textContent = "Linki Kopyala";

        }, 2000);

    });


    native.addEventListener("click", async () => {

        if (navigator.share) {

            await navigator.share({

                title: haber.baslik,

                text: haber.spot || "",

                url: currentUrl

            });

        }

    });

});
