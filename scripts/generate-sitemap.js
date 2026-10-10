"use strict";

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://nabiz-sandy.vercel.app";
const ROOT_DIR = path.join(__dirname, "..");

const HABERLER_FILE = path.join(
    ROOT_DIR,
    "js",
    "haberler.js"
);

const SITEMAP_FILE = path.join(
    ROOT_DIR,
    "sitemap.xml"
);

const haberlerJs = fs.readFileSync(
    HABERLER_FILE,
    "utf8"
);

// slug değerlerini otomatik bul
const sluglar = [
    ...haberlerJs.matchAll(
        /slug\s*:\s*["']([^"']+)["']/g
    )
].map(match => match[1]);

const benzersizSluglar = [
    ...new Set(sluglar)
];

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

const urlListesi = [];

// Ana ve statik sayfalar
for (const sayfa of statikSayfalar) {
    urlListesi.push({
        url: `${SITE_URL}${sayfa}`,
        lastmod: new Date().toISOString()
    });
}

// Haber sayfaları
for (const slug of benzersizSluglar) {
    urlListesi.push({
        url: `${SITE_URL}/haberler/${slug}.html`,
        lastmod: new Date().toISOString()
    });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${urlListesi.map(item => `    <url>
        <loc>${escapeXml(item.url)}</loc>
        <lastmod>${item.lastmod}</lastmod>
    </url>`).join("\n")}
</urlset>
`;

function escapeXml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

fs.writeFileSync(
    SITEMAP_FILE,
    xml,
    "utf8"
);

console.log(
    `NABIZ sitemap oluşturuldu: ${urlListesi.length} URL`
);
