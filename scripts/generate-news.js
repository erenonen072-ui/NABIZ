"use strict";

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://nabiz-sandy.vercel.app";

const ROOT = path.join(__dirname, "..");
const DATA_FILE = path.join(ROOT, "js", "haberler.js");
const OUTPUT_DIR = path.join(ROOT, "haberler");
const SITEMAP_FILE = path.join(ROOT, "sitemap.xml");


// =====================================================
// DOSYALARI OKU
// =====================================================

const data = fs.readFileSync(DATA_FILE, "utf8");


// =====================================================
// HABERLERİ OTOMATİK ÇIKAR
// =====================================================

const match = data.match(
    /window\.NABIZ_HABERLER\s*=\s*(\[[\s\S]*?\]);/
);

if (!match) {
    console.error(
        "NABIZ_HABERLER bulunamadı."
    );
    process.exit(1);
}

let haberler;

try {
    haberler = Function(
        `"use strict"; return ${match[1]}`
    )();
} catch (error) {
    console.error(
        "haberler.js okunamadı:",
        error.message
    );
    process.exit(1);
}

if (!Array.isArray(haberler)) {
    console.error(
        "NABIZ_HABERLER bir dizi değil."
    );
    process.exit(1);
}


// =====================================================
// KLASÖRÜ OLUŞTUR
// =====================================================

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, {
        recursive: true
    });
}


// =====================================================
// HTML GÜVENLİK
// =====================================================

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
    return escapeHTML(value);
}


// =====================================================
// TARİH
// =====================================================

function tarihISO(haber) {
    return (
        haber.tarihISO ||
        new Date().toISOString()
    );
}


// =====================================================
// GÖRSEL
// =====================================================

function gorselURL(haber) {
    const gorsel =
        haber.gorsel ||
        "/images/haber.jpg";

    if (
        gorsel.startsWith("http://") ||
        gorsel.startsWith("https://")
    ) {
        return gorsel;
    }

    return `${SITE_URL}${gorsel.startsWith("/") ? "" : "/"}${gorsel}`;
}


// =====================================================
// HABER İÇERİĞİ
// =====================================================

function haberIcerigi(haber) {

    if (Array.isArray(haber.icerik)) {
        return haber.icerik
            .map(paragraf =>
                `<p>${escapeHTML(paragraf)}</p>`
            )
            .join("\n");
    }

    if (typeof haber.icerik === "string") {
        return haber.icerik
            .split(/\n+/)
            .filter(Boolean)
            .map(paragraf =>
                `<p>${escapeHTML(paragraf.trim())}</p>`
            )
            .join("\n");
    }

    return "";
}


// =====================================================
// NEWSARTICLE SCHEMA
// =====================================================

function newsArticleSchema(haber) {

    const url =
        `${SITE_URL}/haberler/${haber.slug}.html`;

    const image =
        gorselURL(haber);

    const body =
        Array.isArray(haber.icerik)
            ? haber.icerik.join(" ")
            : String(haber.icerik || "");

    const schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",

        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },

        "headline": haber.baslik,

        "description":
            haber.spot || haber.baslik,

        "image": [
            image
        ],

        "datePublished":
            tarihISO(haber),

        "dateModified":
            tarihISO(haber),

        "author": {
            "@type": "Person",
            "name":
                haber.yazar ||
                "NABIZ Haber Merkezi"
        },

        "publisher": {
            "@type": "Organization",
            "name": "NABIZ",
            "logo": {
                "@type": "ImageObject",
                "url":
                    `${SITE_URL}/images/haber.jpg`
            }
        },

        "articleSection":
            haber.kategori || "Haber",

        "articleBody":
            body
    };

    return JSON.stringify(
        schema,
        null,
        4
    );
}


// =====================================================
// HABER HTML OLUŞTUR
// =====================================================

function haberHTML(haber) {

    const url =
        `${SITE_URL}/haberler/${haber.slug}.html`;

    const image =
        gorselURL(haber);

    const icerik =
        haberIcerigi(haber);

    const schema =
        newsArticleSchema(haber);

    return `<!DOCTYPE html>
<html lang="tr">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        ${escapeHTML(haber.baslik)} | NABIZ
    </title>

    <meta
        name="description"
        content="${escapeAttr(
            haber.spot || haber.baslik
        )}"
    >

    <link
        rel="canonical"
        href="${url}"
    >

    <meta
        property="og:type"
        content="article"
    >

    <meta
        property="og:title"
        content="${escapeAttr(haber.baslik)}"
    >

    <meta
        property="og:description"
        content="${escapeAttr(
            haber.spot || haber.baslik
        )}"
    >

    <meta
        property="og:url"
        content="${url}"
    >

    <meta
        property="og:image"
        content="${image}"
    >

    <meta
        property="og:site_name"
        content="NABIZ"
    >

    <meta
        name="twitter:card"
        content="summary_large_image"
    >

    <meta
        name="twitter:title"
        content="${escapeAttr(haber.baslik)}"
    >

    <meta
        name="twitter:description"
        content="${escapeAttr(
            haber.spot || haber.baslik
        )}"
    >

    <meta
        name="twitter:image"
        content="${image}"
    >

    <script type="application/ld+json">
${schema}
    </script>

    <link
        rel="stylesheet"
        href="/css/style.css?v=22"
    >

    <link
        rel="stylesheet"
        href="/css/haber.css?v=22"
    >

</head>

<body>

<header class="site-header">

    <div class="header-inner">

        <a
            href="/"
            class="site-logo"
        >
            <img
                src="/images/haber.jpg"
                alt="NABIZ"
            >
        </a>

        <nav class="main-nav">

            <a href="/">Ana Sayfa</a>
            <a href="/gundem.html">Gündem</a>
            <a href="/ekonomi.html">Ekonomi</a>
            <a href="/spor.html">Spor</a>
            <a href="/dunya.html">Dünya</a>
            <a href="/teknoloji.html">Teknoloji</a>

        </nav>

    </div>

</header>


<main class="article-page">

    <div class="article-container">

        <article>

            <div class="article-category">
                ${escapeHTML(
                    haber.kategori || "Haber"
                )}
            </div>

            <h1 class="article-title">
                ${escapeHTML(haber.baslik)}
            </h1>

            <p class="article-spot">
                ${escapeHTML(
                    haber.spot || ""
                )}
            </p>

            <div class="article-meta">

                <span>
                    ${escapeHTML(
                        haber.yazar ||
                        "NABIZ Haber Merkezi"
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        haber.tarih || ""
                    )}
                </span>

                <span>
                    ${escapeHTML(
                        haber.saat || ""
                    )}
                </span>

            </div>

            <div class="article-image">

                <img
                    src="${image}"
                    alt="${escapeAttr(haber.baslik)}"
                    fetchpriority="high"
                    decoding="async"
                >

            </div>

            <div class="article-content">

                ${icerik}

            </div>


            <!-- PAYLAŞ -->

            <div class="share-box">

                <div class="share-title">
                    <span></span>
                    <strong>Haberi Paylaş</strong>
                </div>

                <div class="share-buttons">

                    <button
                        type="button"
                        class="share-button share-main"
                        id="nativeShare"
                    >
                        📤 Paylaş
                    </button>

                    <a
                        class="share-button whatsapp"
                        id="whatsappShare"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp
                    </a>

                    <a
                        class="share-button x-share"
                        id="xShare"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        𝕏
                    </a>

                    <button
                        type="button"
                        class="share-button copy-share"
                        id="copyShare"
                    >
                        🔗 Linki Kopyala
                    </button>

                </div>

            </div>

        </article>

    </div>

</main>


<footer class="site-footer">

    <p>
        © ${new Date().getFullYear()}
        NABIZ - Türkiye'nin Haber Portalı
    </p>

</footer>


<script>

const paylasimUrl =
    ${JSON.stringify(url)};

const paylasimBaslik =
    ${JSON.stringify(haber.baslik)};


// WhatsApp

const whatsappShare =
    document.getElementById(
        "whatsappShare"
    );

if (whatsappShare) {

    whatsappShare.href =
        "https://wa.me/?text=" +
        encodeURIComponent(
            paylasimBaslik +
            " " +
            paylasimUrl
        );

}


// X

const xShare =
    document.getElementById(
        "xShare"
    );

if (xShare) {

    xShare.href =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
            paylasimBaslik
        ) +
        "&url=" +
        encodeURIComponent(
            paylasimUrl
        );

}


// Yerel paylaşım

const nativeShare =
    document.getElementById(
        "nativeShare"
    );

if (nativeShare) {

    nativeShare.addEventListener(
        "click",
        async function () {

            if (
                navigator.share
            ) {

                try {

                    await navigator.share({
                        title:
                            paylasimBaslik,
                        url:
                            paylasimUrl
                    });

                } catch (error) {}

            } else {

                try {

                    await navigator.clipboard.writeText(
                        paylasimUrl
                    );

                    nativeShare.textContent =
                        "✓ Link Kopyalandı";

                    setTimeout(
                        () => {
                            nativeShare.textContent =
                                "📤 Paylaş";
                        },
                        1500
                    );

                } catch (error) {

                    alert(
                        paylasimUrl
                    );

                }

            }

        }
    );

}


// Link kopyala

const copyShare =
    document.getElementById(
        "copyShare"
    );

if (copyShare) {

    copyShare.addEventListener(
        "click",
        async function () {

            try {

                await navigator.clipboard.writeText(
                    paylasimUrl
                );

                copyShare.textContent =
                    "✓ Kopyalandı";

                setTimeout(
                    () => {

                        copyShare.textContent =
                            "🔗 Linki Kopyala";

                    },
                    1500
                );

            } catch (error) {

                alert(
                    "Link: " +
                    paylasimUrl
                );

            }

        }
    );

}

</script>

</body>
</html>`;
}


// =====================================================
// HABERLERİ OLUŞTUR
// =====================================================

let olusturulan = 0;

for (const haber of haberler) {

    if (!haber.slug) {
        console.warn(
            "Slug olmayan haber atlandı:",
            haber.baslik
        );

        continue;
    }

    const dosya =
        path.join(
            OUTPUT_DIR,
            `${haber.slug}.html`
        );

    fs.writeFileSync(
        dosya,
        haberHTML(haber),
        "utf8"
    );

    console.log(
        `✓ ${haber.slug}.html`
    );

    olusturulan++;
}


// =====================================================
// SITEMAP
// =====================================================

const statikSayfalar = [
    "/",
    "/gundem.html",
    "/ekonomi.html",
    "/spor.html",
    "/dunya.html",
    "/teknoloji.html",
    "/hakkimizda.html",
    "/iletisim.html",
    "/gizlilik.html",
    "/cerez-politikasi.html",
    "/kullanim-sartlari.html"
];

const urls = [];

for (const sayfa of statikSayfalar) {

    urls.push({
        loc:
            `${SITE_URL}${sayfa}`,
        lastmod:
            new Date().toISOString()
    });

}

for (const haber of haberler) {

    if (!haber.slug) continue;

    urls.push({
        loc:
            `${SITE_URL}/haberler/${haber.slug}.html`,
        lastmod:
            haber.tarihISO ||
            new Date().toISOString()
    });

}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>

${urls.map(item => `
    <url>
        <loc>${item.loc}</loc>
        <lastmod>${item.lastmod}</lastmod>
    </url>
`).join("")}

</urlset>
`;

fs.writeFileSync(
    SITEMAP_FILE,
    sitemap,
    "utf8"
);


// =====================================================
// ROBOTS
// =====================================================

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

fs.writeFileSync(
    path.join(ROOT, "robots.txt"),
    robots,
    "utf8"
);


console.log("");
console.log(
    "===================================="
);
console.log(
    "NABIZ BUILD TAMAMLANDI"
);
console.log(
    `Haber sayısı: ${olusturulan}`
);
console.log(
    `Sitemap URL: ${urls.length}`
);
console.log(
    "===================================="
);
