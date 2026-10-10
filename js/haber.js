"use strict";

document.addEventListener("DOMContentLoaded", () => {

    const haberler =
        window.NABIZ_HABERLER || [];

    const content =
        document.getElementById("articleContent");

    if (!content) return;


    /* =================================================
       YARDIMCI
    ================================================= */

    const FALLBACK_IMAGE =
        "/images/haber.jpg";


    function temizle(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function haberUrl(haber) {

        return `/haberler/${haber.slug}.html`;

    }


    /* =================================================
       SLUG BUL
    ================================================= */

    const slug =
        window.location.pathname
            .split("/")
            .pop()
            .replace(".html", "");


    const haber =
        haberler.find(
            item => item.slug === slug
        );


    /* =================================================
       HABER BULUNAMADI
    ================================================= */

    if (!haber) {

        content.innerHTML = `

            <div style="
                padding:90px 30px;
                text-align:center;
            ">

                <strong style="
                    display:block;
                    font-size:60px;
                    line-height:1;
                    color:#111;
                ">
                    404
                </strong>

                <h1>
                    Haber bulunamadı
                </h1>

                <p style="
                    color:#777;
                ">
                    Aradığınız haber mevcut değil.
                </p>

                <a
                    href="/"
                    style="
                        display:inline-flex;
                        margin-top:15px;
                        padding:12px 22px;
                        background:#e30613;
                        color:white;
                        text-decoration:none;
                        font-weight:800;
                    "
                >
                    Ana Sayfaya Dön
                </a>

            </div>

        `;

        return;

    }


    /* =================================================
       BAŞLIK
    ================================================= */

    document.title =
        `${haber.baslik} | NABIZ`;


    /* =================================================
       META
    ================================================= */

    const description =
        haber.spot ||
        haber.baslik ||
        "NABIZ haber";


    let descriptionTag =
        document.querySelector(
            'meta[name="description"]'
        );


    if (descriptionTag) {

        descriptionTag.setAttribute(
            "content",
            description
        );

    }


    /* =================================================
       OPEN GRAPH
    ================================================= */

    const ogTitle =
        document.querySelector(
            'meta[property="og:title"]'
        );

    const ogDescription =
        document.querySelector(
            'meta[property="og:description"]'
        );

    const ogImage =
        document.querySelector(
            'meta[property="og:image"]'
        );


    if (ogTitle) {

        ogTitle.content =
            haber.baslik;

    }


    if (ogDescription) {

        ogDescription.content =
            description;

    }


    if (ogImage) {

        ogImage.content =
            haber.gorsel ||
            FALLBACK_IMAGE;

    }


    /* =================================================
       BREADCRUMB
    ================================================= */

    const breadcrumb =
        document.getElementById(
            "breadcrumbCategory"
        );


    if (breadcrumb) {

        breadcrumb.textContent =
            haber.kategori ||
            "Haber";

    }


    /* =================================================
       HABER METNİ
    ================================================= */

    let metin = "";


    if (Array.isArray(haber.icerik)) {

        metin =
            haber.icerik
                .map(paragraf => {

                    return `
                        <p>
                            ${temizle(paragraf)}
                        </p>
                    `;

                })
                .join("");

    } else {

        metin = `
            <p>
                ${temizle(haber.icerik)}
            </p>
        `;

    }


    /* =================================================
       HABERİ OLUŞTUR
    ================================================= */

    content.innerHTML = `

        <div class="article-category">

            ${temizle(
                haber.kategori ||
                "HABER"
            )}

        </div>


        <h1 class="article-title">

            ${temizle(
                haber.baslik
            )}

        </h1>


        ${
            haber.spot
                ? `
                    <div class="article-spot">

                        ${temizle(
                            haber.spot
                        )}

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
                ${temizle(
                    haber.tarih ||
                    ""
                )}
            </span>


            ${
                haber.saat
                    ? `
                        <span>
                            ${temizle(
                                haber.saat
                            )}
                        </span>
                    `
                    : ""
            }


            ${
                haber.goruntulenme
                    ? `
                        <span>
                            ${Number(
                                haber.goruntulenme
                            ).toLocaleString(
                                "tr-TR"
                            )} görüntülenme
                        </span>
                    `
                    : ""
            }


        </div>


        <div class="article-image">

            <img
                src="${haber.gorsel || FALLBACK_IMAGE}"
                alt="${temizle(haber.baslik)}"
                fetchpriority="high"
                decoding="async"
                onerror="
                    this.onerror=null;
                    this.src='${FALLBACK_IMAGE}';
                "
            >

        </div>


        <div class="article-text">

            ${metin}

        </div>

    `;


    /* =================================================
       PAYLAŞIM
    ================================================= */

    const currentUrl =
        window.location.href;

    const title =
        haber.baslik;


    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );


    if (whatsapp) {

        whatsapp.href =
            "https://wa.me/?text=" +
            encodeURIComponent(
                title +
                " " +
                currentUrl
            );

    }


    const x =
        document.getElementById(
            "xShare"
        );


    if (x) {

        x.href =
            "https://twitter.com/intent/tweet?text=" +
            encodeURIComponent(title) +
            "&url=" +
            encodeURIComponent(
                currentUrl
            );

    }


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
                        .writeText(
                            currentUrl
                        );

                    copy.textContent =
                        "Kopyalandı";

                    setTimeout(() => {

                        copy.textContent =
                            "Linki Kopyala";

                    }, 1800);

                } catch {

                    alert(
                        currentUrl
                    );

                }

            }
        );

    }


    const nativeShare =
        document.getElementById(
            "nativeShare"
        );


    if (nativeShare) {

        nativeShare.addEventListener(
            "click",
            async () => {

                if (
                    navigator.share
                ) {

                    try {

                        await navigator.share({

                            title:
                                title,

                            text:
                                haber.spot ||
                                title,

                            url:
                                currentUrl

                        });

                    } catch {}

                } else {

                    try {

                        await navigator.clipboard
                            .writeText(
                                currentUrl
                            );

                        nativeShare.textContent =
                            "Link Kopyalandı";

                        setTimeout(() => {

                            nativeShare.textContent =
                                "Paylaş";

                        }, 1800);

                    } catch {}

                }

            }
        );

    }


    /* =================================================
       ÇOK OKUNANLAR
    ================================================= */

    const popular =
        document.getElementById(
            "articlePopular"
        );


    if (popular) {

        const popularList =
            haberler
                .filter(
                    item =>
                        item.slug !==
                        haber.slug
                )
                .sort(
                    (a, b) =>
                        (b.goruntulenme || 0) -
                        (a.goruntulenme || 0)
                )
                .slice(0, 5);


        popular.innerHTML =
            popularList
                .map(item => {

                    return `

                        <a
                            href="${haberUrl(item)}"
                            class="article-popular-item"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <img
                                src="${item.gorsel || FALLBACK_IMAGE}"
                                alt="${temizle(item.baslik)}"
                                loading="lazy"
                                onerror="
                                    this.onerror=null;
                                    this.src='${FALLBACK_IMAGE}';
                                "
                            >

                            <h3>
                                ${temizle(
                                    item.baslik
                                )}
                            </h3>

                        </a>

                    `;

                })
                .join("");

    }


    /* =================================================
       BENZER HABERLER
    ================================================= */

    const related =
        document.getElementById(
            "relatedNews"
        );


    if (related) {

        let relatedList =
            haberler
                .filter(
                    item =>
                        item.slug !==
                        haber.slug &&
                        item.kategori ===
                        haber.kategori
                )
                .sort(
                    (a, b) =>
                        new Date(
                            b.tarihISO || 0
                        ) -
                        new Date(
                            a.tarihISO || 0
                        )
                )
                .slice(0, 3);


        if (
            relatedList.length < 3
        ) {

            const ekstra =
                haberler
                    .filter(
                        item =>
                            item.slug !==
                            haber.slug &&
                            !relatedList.some(
                                x =>
                                    x.slug ===
                                    item.slug
                            )
                    )
                    .sort(
                        (a, b) =>
                            new Date(
                                b.tarihISO || 0
                            ) -
                            new Date(
                                a.tarihISO || 0
                            )
                    )
                    .slice(
                        0,
                        3 -
                        relatedList.length
                    );


            relatedList =
                [
                    ...relatedList,
                    ...ekstra
                ];

        }


        related.innerHTML =
            relatedList
                .map(item => {

                    return `

                        <a
                            href="${haberUrl(item)}"
                            class="related-card"
                            target="_blank"
                            rel="noopener noreferrer"
                        >

                            <img
                                src="${item.gorsel || FALLBACK_IMAGE}"
                                alt="${temizle(item.baslik)}"
                                loading="lazy"
                                onerror="
                                    this.onerror=null;
                                    this.src='${FALLBACK_IMAGE}';
                                "
                            >

                            <h3>
                                ${temizle(
                                    item.baslik
                                )}
                            </h3>

                        </a>

                    `;

                })
                .join("");

    }


    /* =================================================
       NEWSARTICLE SCHEMA
    ================================================= */

    const schema =
        document.createElement(
            "script"
        );


    schema.type =
        "application/ld+json";


    schema.textContent =
        JSON.stringify({

            "@context":
                "https://schema.org",

            "@type":
                "NewsArticle",

            headline:
                haber.baslik,

            description:
                description,

            image: [
                haber.gorsel ||
                FALLBACK_IMAGE
            ],

            datePublished:
                haber.tarihISO ||
                undefined,

            dateModified:
                haber.tarihISO ||
                undefined,

            author: {

                "@type":
                    "Person",

                name:
                    haber.yazar ||
                    "NABIZ Haber Merkezi"

            },

            publisher: {

                "@type":
                    "Organization",

                name:
                    "NABIZ",

                logo: {

                    "@type":
                        "ImageObject",

                    url:
                        `${location.origin}/images/haber.jpg`

                }

            },

            mainEntityOfPage: {

                "@type":
                    "WebPage",

                "@id":
                    currentUrl

            }

        });


    document.head.appendChild(
        schema
    );

});
