document.addEventListener("DOMContentLoaded", () => {

    const haberler =
        Array.isArray(window.haberler)
            ? window.haberler
            : [];


    /* =====================================================
       SLUG OLUŞTUR
    ===================================================== */

    function slugify(text) {

        return String(text || "")
            .toLocaleLowerCase("tr-TR")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/ı/g, "i")
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }


    /* =====================================================
       URL'DEN SLUG AL
    ===================================================== */

    const path =
        window.location.pathname;


    const parts =
        path.split("/").filter(Boolean);


    let slug =
        "";


    if (parts[0] === "haber") {

        slug =
            parts.slice(1).join("-");

    }


    /* =====================================================
       ESKİ ?id= SİSTEMİ DE ÇALIŞSIN
    ===================================================== */

    const params =
        new URLSearchParams(
            window.location.search
        );


    const oldId =
        Number(params.get("id"));


    /* =====================================================
       HABERİ BUL
    ===================================================== */

    let haber = null;


    if (slug) {

        haber =
            haberler.find(
                item =>
                    slugify(item.baslik) ===
                    slug
            );

    }


    if (!haber && oldId) {

        haber =
            haberler.find(
                item =>
                    Number(item.id) ===
                    oldId
            );

    }


    const content =
        document.getElementById(
            "articleContent"
        );


    if (!content)
        return;


    /* =====================================================
       HABER BULUNAMADI
    ===================================================== */

    if (!haber) {

        content.innerHTML = `

            <div class="article-not-found">

                <h1>
                    Haber bulunamadı
                </h1>

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


    /* =====================================================
       DOĞRU URL
    ===================================================== */

    const correctUrl =
        `/haber/${slugify(
            haber.baslik
        )}/`;


    /* =====================================================
       SAYFA BAŞLIĞI
    ===================================================== */

    document.title =
        `${haber.baslik} | NABIZ`;


    /* =====================================================
       CANONICAL
    ===================================================== */

    let canonical =
        document.querySelector(
            'link[rel="canonical"]'
        );


    if (!canonical) {

        canonical =
            document.createElement("link");

        canonical.rel =
            "canonical";

        document.head.appendChild(
            canonical
        );

    }


    canonical.href =
        `${window.location.origin}${correctUrl}`;


    /* =====================================================
       HABER
    ===================================================== */

    content.innerHTML = `

        <div class="article-category">
            ${haber.kategori || "HABER"}
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
                ${haber.saat || ""}
            </span>

            <span>
                ${haber.kaynak || "NABIZ"}
            </span>

        </div>


        <img
            class="article-image"
            src="${haber.gorsel || "/images/haber11.png"}"
            alt="${haber.baslik}"
        >


        <div class="article-text">
            ${haber.icerik || ""}
        </div>

    `;


    /* =====================================================
       PAYLAŞIM URL
    ===================================================== */

    const url =
        window.location.origin +
        correctUrl;


    const encodedUrl =
        encodeURIComponent(url);


    const encodedTitle =
        encodeURIComponent(
            haber.baslik
        );


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );


    if (whatsapp) {

        whatsapp.href =
            `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;

    }


    /* =====================================================
       X
    ===================================================== */

    const x =
        document.getElementById(
            "xShare"
        );


    if (x) {

        x.href =
            `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    }


    /* =====================================================
       LİNK KOPYALA
    ===================================================== */

    const copy =
        document.getElementById(
            "copyShare"
        );


    if (copy) {

        copy.addEventListener(
            "click",
            async () => {

                try {

                    await navigator.clipboard
                        .writeText(url);

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


    /* =====================================================
       TELEFON PAYLAŞ
    ===================================================== */

    const share =
        document.getElementById(
            "nativeShare"
        );


    if (share) {

        share.addEventListener(
            "click",
            async () => {

                if (navigator.share) {

                    try {

                        await navigator.share({

                            title:
                                haber.baslik,

                            text:
                                haber.spot || "",

                            url:
                                url

                        });

                    } catch {}

                } else {

                    try {

                        await navigator.clipboard
                            .writeText(url);

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
