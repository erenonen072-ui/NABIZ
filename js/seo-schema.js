"use strict";

(() => {
    const SITE_URL = "https://nabiz-sandy.vercel.app";
    const haberler = window.NABIZ_HABERLER || [];

    const yol = window.location.pathname;
    const eslesme = yol.match(/\/haberler\/([^/]+)\.html$/);

    if (!eslesme) return;

    const slug = decodeURIComponent(eslesme[1]);
    const haber = haberler.find(item => item.slug === slug);

    if (!haber) return;

    const gorsel = haber.gorsel || "/images/haber.jpg";
    const gorselURL = new URL(gorsel, SITE_URL).href;
    const haberURL = `${SITE_URL}/haberler/${haber.slug}.html`;

    const schema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": haberURL
        },
        "headline": haber.baslik,
        "description": haber.spot || haber.baslik,
        "image": [gorselURL],
        "datePublished": haber.tarihISO,
        "dateModified": haber.tarihISO,
        "author": {
            "@type": "Organization",
            "name": haber.yazar || "NABIZ Haber Merkezi"
        },
        "publisher": {
            "@type": "Organization",
            "name": "NABIZ",
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/images/haber.jpg`
            }
        },
        "articleSection": haber.kategori,
        "articleBody": Array.isArray(haber.icerik)
            ? haber.icerik.join(" ")
            : (haber.icerik || "")
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "nabiz-news-schema";
    script.textContent = JSON.stringify(schema);

    document.head.appendChild(script);
})();
