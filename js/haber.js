"use strict";

/* =========================================================
   NABIZ - HABER DETAY
========================================================= */

const haberler = window.NABIZ_HABERLER || [];
const FALLBACK_IMAGE = "/images/haber.jpg";

/* ---------------------------------------------------------
   GÜVENLİ HTML
--------------------------------------------------------- */

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ---------------------------------------------------------
   URL
--------------------------------------------------------- */

function haberUrl(haber) {
    if (!haber || !haber.slug) return "#";
    return `/haberler/${haber.slug}.html`;
}

/* ---------------------------------------------------------
   GÖRSEL
--------------------------------------------------------- */

function haberGorsel(haber) {
    return haber && haber.gorsel
        ? haber.gorsel
        : FALLBACK_IMAGE;
}

/* ---------------------------------------------------------
   SLUG BUL
--------------------------------------------------------- */

function aktifSlug() {
    const pathname = window.location.pathname;

    const match = pathname.match(/\/haberler\/([^/]+)\.html/i);

    if (match) {
        return decodeURIComponent(match[1]);
    }

    return "";
}

/* ---------------------------------------------------------
   HABER BUL
--------------------------------------------------------- */

function aktifHaberiBul() {
    const slug = aktifSlug();

    return haberler.find(haber =>
        String(haber.slug || "") === slug
    );
}

/* ---------------------------------------------------------
   METİN
--------------------------------------------------------- */

function haberIcerigi(haber) {
    if (!haber) return [];

    if (Array.isArray(haber.icerik)) {
        return haber.icerik.filter(Boolean);
    }

    if (typeof haber.icerik === "string") {
        return haber.icerik
            .split(/\n+/)
            .map(metin => metin.trim())
            .filter(Boolean);
    }

    return [];
}

/* ---------------------------------------------------------
   HABERİ GÖSTER
--------------------------------------------------------- */

function haberiGoster(haber) {

    const alan = document.getElementById("articleContent");

    if (!alan) return;

    if (!haber) {

        alan.innerHTML = `
            <div class="empty-news">
                <h1>Haber bulunamadı</h1>
                <p>Aradığınız haber mevcut değil veya kaldırılmış olabilir.</p>
            </div>
        `;

        document.title = "Haber bulunamadı | NABIZ";

        return;
    }

    const kategori = escapeHTML(
        haber.kategori || "Haber"
    );

    const baslik = escapeHTML(
        haber.baslik || "NABIZ"
    );

    const spot = escapeHTML(
        haber.spot || ""
    );

    const tarih = escapeHTML(
        haber.tarih || ""
    );

    const saat = escapeHTML(
        haber.saat || ""
    );

    const yazar = escapeHTML(
        haber.yazar || "NABIZ Haber Merkezi"
    );

    const kaynak = escapeHTML(
        haber.kaynak || "NABIZ"
    );

    const gorsel = escapeHTML(
        haberGorsel(haber)
    );

    const paragraflar = haberIcerigi(haber);

    alan.innerHTML = `
        <div class="article-category">
            ${kategori}
        </div>

        <h1 class="article-title">
            ${baslik}
        </h1>

        ${
            spot
                ? `
                    <p class="article-spot">
                        ${spot}
                    </p>
                `
                : ""
        }

        <div class="article-meta">

            ${
                tarih
                    ? `<span>${tarih}</span>`
                    : ""
            }

            ${
                saat
                    ? `<span>${saat}</span>`
                    : ""
            }

            <span>${yazar}</span>

            <span>${kaynak}</span>

        </div>

        <figure class="article-image">

            <img
                src="${gorsel}"
                alt="${baslik}"
                fetchpriority="high"
                decoding="async"
                onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
            >

        </figure>

        <div class="article-text">

            ${
                paragraflar.length
                    ? paragraflar.map(paragraf => `
                        <p>
                            ${escapeHTML(paragraf)}
                        </p>
                    `).join("")
                    : `
                        <p>
                            Bu haberle ilgili gelişmeler NABIZ tarafından
                            takip edilmektedir.
                        </p>
                    `
            }

        </div>
    `;

    const breadcrumb =
        document.getElementById("breadcrumbCategory");

    if (breadcrumb) {
        breadcrumb.textContent =
            haber.kategori || "Haber";
    }

    document.title =
        `${haber.baslik || "Haber"} | NABIZ`;

    metaGuncelle(haber);
    schemaOlustur(haber);
}

/* ---------------------------------------------------------
   META / SEO
--------------------------------------------------------- */

function metaGuncelle(haber) {

    const baslik =
        haber.baslik || "NABIZ";

    const aciklama =
        haber.spot ||
        `${baslik} - NABIZ`;

    const gorsel =
        haberGorsel(haber);

    document.title =
        `${baslik} | NABIZ`;

    const description =
        document.querySelector('meta[name="description"]');

    if (description) {
        description.setAttribute(
            "content",
            aciklama
        );
    }

    const ogTitle =
        document.querySelector(
            'meta[property="og:title"]'
        );

    if (ogTitle) {
        ogTitle.setAttribute(
            "content",
            baslik
        );
    }

    const ogDescription =
        document.querySelector(
            'meta[property="og:description"]'
        );

    if (ogDescription) {
        ogDescription.setAttribute(
            "content",
            aciklama
        );
    }

    const ogImage =
        document.querySelector(
            'meta[property="og:image"]'
        );

    if (ogImage) {
        ogImage.setAttribute(
            "content",
            gorsel
        );
    }

    let canonical =
        document.querySelector(
            'link[rel="canonical"]'
        );

    if (!canonical) {

        canonical =
            document.createElement("link");

        canonical.rel = "canonical";

        document.head.appendChild(
            canonical
        );
    }

    canonical.href =
        window.location.origin +
        window.location.pathname;
}

/* ---------------------------------------------------------
   NEWS ARTICLE SCHEMA
--------------------------------------------------------- */

function schemaOlustur(haber) {

    const eski =
        document.getElementById(
            "nabizNewsArticleSchema"
        );

    if (eski) {
        eski.remove();
    }

    const schema =
        document.createElement("script");

    schema.id =
        "nabizNewsArticleSchema";

    schema.type =
        "application/ld+json";

    const icerik =
        haberIcerigi(haber).join(" ");

    schema.textContent =
        JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",

            headline:
                haber.baslik || "",

            description:
                haber.spot || "",

            image: [
                window.location.origin +
                haberGorsel(haber)
            ],

            datePublished:
                haber.tarihISO ||
                "",

            dateModified:
                haber.tarihISO ||
                "",

            author: {
                "@type": "Person",
                name:
                    haber.yazar ||
                    "NABIZ Haber Merkezi"
            },

            publisher: {
                "@type": "Organization",
                name: "NABIZ",
                logo: {
                    "@type": "ImageObject",
                    url:
                        window.location.origin +
                        "/images/haber.jpg"
                }
            },

            mainEntityOfPage: {
                "@type": "WebPage",
                "@id":
                    window.location.href
            },

            articleBody:
                icerik
        });

    document.head.appendChild(schema);
}

/* ---------------------------------------------------------
   ÇOK OKUNANLAR
--------------------------------------------------------- */

function cokOkunanlariGoster(aktif) {

    const alan =
        document.getElementById(
            "articlePopular"
        );

    if (!alan) return;

    const liste =
        [...haberler]
            .filter(haber =>
                haber.slug !== aktif.slug
            )
            .sort((a, b) =>
                (b.goruntulenme || 0) -
                (a.goruntulenme || 0)
            )
            .slice(0, 5);

    if (!liste.length) {

        alan.innerHTML =
            `<p class="empty-news">
                Henüz haber bulunmuyor.
            </p>`;

        return;
    }

    alan.innerHTML =
        liste.map(haber => {

            const baslik =
                escapeHTML(
                    haber.baslik || ""
                );

            const gorsel =
                escapeHTML(
                    haberGorsel(haber)
                );

            return `
                <a
                    href="${haberUrl(haber)}"
                    class="article-popular-item"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <img
                        src="${gorsel}"
                        alt="${baslik}"
                        loading="lazy"
                        decoding="async"
                        onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                    >

                    <h3>
                        ${baslik}
                    </h3>

                </a>
            `;

        }).join("");
}

/* ---------------------------------------------------------
   BENZER HABERLER
--------------------------------------------------------- */

function benzerHaberleriGoster(aktif) {

    const alan =
        document.getElementById(
            "relatedNews"
        );

    if (!alan) return;

    let liste =
        haberler.filter(haber =>
            haber.slug !== aktif.slug &&
            haber.kategori === aktif.kategori
        );

    if (liste.length < 3) {

        const diger =
            haberler.filter(haber =>
                haber.slug !== aktif.slug &&
                haber.kategori !== aktif.kategori
            );

        liste = [
            ...liste,
            ...diger
        ];
    }

    liste =
        liste
            .filter(
                (haber, index, arr) =>
                    arr.findIndex(
                        x => x.slug === haber.slug
                    ) === index
            )
            .slice(0, 3);

    if (!liste.length) {

        alan.innerHTML =
            `<p class="empty-news">
                Benzer haber bulunmuyor.
            </p>`;

        return;
    }

    alan.innerHTML =
        liste.map(haber => {

            const baslik =
                escapeHTML(
                    haber.baslik || ""
                );

            const gorsel =
                escapeHTML(
                    haberGorsel(haber)
                );

            return `
                <article class="related-card">

                    <a
                        href="${haberUrl(haber)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >

                        <img
                            src="${gorsel}"
                            alt="${baslik}"
                            loading="lazy"
                            decoding="async"
                            onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}';"
                        >

                        <h3>
                            ${baslik}
                        </h3>

                    </a>

                </article>
            `;

        }).join("");
}

/* ---------------------------------------------------------
   PAYLAŞ
--------------------------------------------------------- */

function paylasimSistemi(haber) {

    const url =
        window.location.href;

    const baslik =
        haber.baslik || "NABIZ";

    const whatsapp =
        document.getElementById(
            "whatsappShare"
        );

    if (whatsapp) {

        whatsapp.href =
            `https://wa.me/?text=${encodeURIComponent(
                baslik + " " + url
            )}`;

    }

    const x =
        document.getElementById(
            "xShare"
        );

    if (x) {

        x.href =
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                baslik
            )}&url=${encodeURIComponent(
                url
            )}`;

    }

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
                            text:
                                haber.spot ||
                                baslik,
                            url
                        });

                    } catch (error) {
                        /* Kullanıcı paylaşımı iptal etti */
                    }

                } else {

                    await linkKopyala(url);

                    native.textContent =
                        "Link Kopyalandı";

                    setTimeout(() => {
                        native.textContent =
                            "Paylaş";
                    }, 1500);

                }

            }
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

                await linkKopyala(url);

                copy.textContent =
                    "Kopyalandı";

                setTimeout(() => {

                    copy.textContent =
                        "Linki Kopyala";

                }, 1500);

            }
        );

    }
}

/* ---------------------------------------------------------
   KOPYALA
--------------------------------------------------------- */

async function linkKopyala(url) {

    try {

        await navigator.clipboard.writeText(
            url
        );

    } catch (error) {

        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.value = url;

        textarea.style.position =
            "fixed";

        textarea.style.opacity = "0";

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand(
            "copy"
        );

        textarea.remove();
    }
}

/* ---------------------------------------------------------
   BAŞLAT
--------------------------------------------------------- */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const haber =
            aktifHaberiBul();

        haberiGoster(haber);

        if (!haber) return;

        cokOkunanlariGoster(
            haber
        );

        benzerHaberleriGoster(
            haber
        );

        paylasimSistemi(
            haber
        );

    }
);
