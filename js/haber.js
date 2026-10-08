document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.haberler || [];

    const params = new URLSearchParams(
        window.location.search
    );

    const id = Number(params.get("id"));

    const haber = haberler.find(
        item => item.id === id
    );

    const content =
        document.getElementById("articleContent");

    if (!content) return;

    if (!haber) {

        content.innerHTML = `
            <div class="article-not-found">
                <h1>Haber bulunamadı</h1>

                <p>
                    Aradığınız haber mevcut değil
                    veya bağlantı hatalı.
                </p>

                <a href="/">
                    Ana sayfaya dön
                </a>
            </div>
        `;

        return;
    }

    /* SAYFA BAŞLIĞI */

    document.title =
        `${haber.baslik} | NABIZ`;


    /* HABER */

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

            <span>
                ${haber.tarih}
            </span>

            <span>
                ${haber.saat || ""}
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
            ${haber.icerik}
        </div>

    `;


    /* PAYLAŞIM */

    const url =
        window.location.href;

    const encodedUrl =
        encodeURIComponent(url);

    const encodedTitle =
        encodeURIComponent(
            haber.baslik
        );


    /* WHATSAPP */

    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );

    if (whatsapp) {

        whatsapp.href =
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

    }


    /* X */

    const x =
        document.getElementById(
            "xShare"
        );

    if (x) {

        x.href =
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    }


    /* LİNK KOPYALA */

    const copy =
        document.getElementById(
            "copyShare"
        );

    if (copy) {

        copy.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard.writeText(
                        url
                    );

                    copy.textContent =
                        "Kopyalandı ✓";

                    setTimeout(() => {

                        copy.textContent =
                            "Linki Kopyala";

                    }, 2000);

                } catch {

                    alert(
                        "Link kopyalanamadı."
                    );

                }

            }
        );

    }


    /* PAYLAŞ */

    const share =
        document.getElementById(
            "nativeShare"
        );

    if (share) {

        share.addEventListener(
            "click",
            async () => {

                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({
                            title: haber.baslik,
                            text: haber.spot,
                            url: url
                        });

                    } catch {

                        // Kullanıcı paylaşımı iptal etti.

                    }

                } else {

                    try {

                        await navigator.clipboard.writeText(
                            url
                        );

                        share.textContent =
                            "Link Kopyalandı ✓";

                        setTimeout(() => {

                            share.textContent =
                                "Paylaş";

                        }, 2000);

                    } catch {

                        alert(
                            "Paylaşım desteklenmiyor."
                        );

                    }

                }

            }
        );

    }

});
