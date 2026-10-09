"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const haberler = window.NABIZ_HABERLER || [];

    const content =
        document.getElementById("articleContent");

    if (!content) return;


    /* =====================================
       HABERİ BUL
    ===================================== */

    const dosyaAdi =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");

    let haber =
        haberler.find(h =>
            h.slug === dosyaAdi
        );


    /* =====================================
       HABER BULUNAMADI
    ===================================== */

    if (!haber) {

        content.innerHTML = `
            <div style="
                padding:80px 30px;
                text-align:center;
            ">

                <div style="
                    font-size:50px;
                    margin-bottom:15px;
                ">
                    404
                </div>

                <h1>
                    Haber bulunamadı
                </h1>

                <p style="
                    color:#777;
                    margin:10px 0 25px;
                ">
                    Aradığınız haber mevcut değil
                    veya kaldırılmış olabilir.
                </p>

                <a
                    href="/"
                    style="
                        display:inline-flex;
                        padding:12px 20px;
                        background:#e30613;
                        color:#fff;
                        border-radius:6px;
                        font-weight:800;
                    "
                >
                    Ana Sayfaya Dön
                </a>

            </div>
        `;

        return;
    }


    /* =====================================
       GÜVENLİ HTML
    ===================================== */

    function temizle(metin) {

        if (!metin) return "";

        return String(metin)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* =====================================
       İÇERİK
    ===================================== */

    let paragraflar = "";

    if (Array.isArray(haber.icerik)) {

        paragraflar =
            haber.icerik
                .map(paragraf => `
                    <p>
                        ${temizle(paragraf)}
                    </p>
                `)
                .join("");

    } else {

        paragraflar = `
            <p>
                ${temizle(haber.icerik)}
            </p>
        `;
    }


    /* =====================================
       HABERİ OLUŞTUR
    ===================================== */

    content.innerHTML = `

        <div class="article-category">
            ${temizle(haber.kategori || "HABER")}
        </div>


        <h1 class="article-title">
            ${temizle(haber.baslik)}
        </h1>


        ${
            haber.spot
                ? `
                    <div class="article-spot">
                        ${temizle(haber.spot)}
                    </div>
                  `
                : ""
        }


        <div class="article-meta">

            <span>
                ${temizle(
                    haber.yazar ||
                    "NABIZ Haber Merkezi"
                )}
            </span>

            <span>
                ${temizle(haber.tarih || "")}
            </span>

            ${
                haber.saat
                    ? `
                        <span>
                            ${temizle(haber.saat)}
                        </span>
                      `
                    : ""
            }

            <span>
                ${temizle(
                    haber.kaynak ||
                    "NABIZ"
                )}
            </span>

        </div>


        <div class="article-image">

            <img
                src="${haber.gorsel || "/images/haber.jpg"}"
                alt="${temizle(haber.baslik)}"
                fetchpriority="high"
                onerror="
                    this.onerror=null;
                    this.src='/images/haber.jpg';
                "
            >

        </div>


        <div class="article-text">

            ${paragraflar}

        </div>

    `;


    /* =====================================
       PAYLAŞIM
    ===================================== */

    const url =
        window.location.href;

    const baslik =
        haber.baslik || "NABIZ Haber";


    /* WhatsApp */

    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );

    if (whatsapp) {

        whatsapp.href =
            "https://wa.me/?text=" +
            encodeURIComponent(
                `${baslik} ${url}`
            );
    }


    /* X */

    const x =
        document.getElementById(
            "xShare"
        );

    if (x) {

        x.href =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(baslik) +
            "&url=" +
            encodeURIComponent(url);
    }


    /* Native Share */

    const native =
        document.getElementById(
            "nativeShare"
        );

    if (native) {

        native.addEventListener(
            "click",
            async () => {

                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({
                            title: baslik,
                            text: haber.spot || baslik,
                            url: url
                        });

                    } catch (error) {}

                } else {

                    try {

                        await navigator.clipboard.writeText(
                            url
                        );

                        native.textContent =
                            "✓ Link Kopyalandı";

                        setTimeout(() => {
                            native.textContent =
                                "↗ Paylaş";
                        }, 1800);

                    } catch (error) {

                        alert(
                            "Link: " + url
                        );

                    }

                }

            }
        );

    }


    /* Link Kopyala */

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
                        "✓ Kopyalandı";

                    setTimeout(() => {

                        copy.textContent =
                            "🔗 Linki Kopyala";

                    }, 1800);

                } catch (error) {

                    alert(
                        "Link: " + url
                    );

                }

            }
        );

    }


    /* =====================================
       ÇOK OKUNANLAR
    ===================================== */

    const popular =
        document.getElementById(
            "articlePopular"
        );

    if (
        popular &&
        haberler.length
    ) {

        const liste =
            [...haberler]
                .filter(h =>
                    h.slug !== haber.slug
                )
                .sort(
                    (a, b) =>
                        (b.goruntulenme || 0) -
                        (a.goruntulenme || 0)
                )
                .slice(0, 5);


        popular.innerHTML =
            liste.map(h => `

                <a
                    href="/haberler/${h.slug}.html"
                    class="article-popular-item"
                >

                    <img
                        src="${h.gorsel || "/images/haber.jpg"}"
                        alt="${temizle(h.baslik)}"
                        loading="lazy"
                        onerror="
                            this.onerror=null;
                            this.src='/images/haber.jpg';
                        "
                    >

                    <h3>
                        ${temizle(h.baslik)}
                    </h3>

                </a>

            `).join("");

    }

});
