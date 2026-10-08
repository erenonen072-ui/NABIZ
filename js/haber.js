document.addEventListener("DOMContentLoaded", () => {

  const haberler = window.haberler || [];

  const path = window.location.pathname
    .split("/")
    .filter(Boolean);

  const current = path[path.length - 1];

  function slugify(text) {
    return text
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
  }

  const haber = haberler.find(item => {
    const slug = slugify(item.baslik);
    return `${item.id}-${slug}` === current;
  });

  const content = document.getElementById("articleContent");

  if (!content) {
    console.error("articleContent bulunamadı.");
    return;
  }

  if (!haber) {
    content.innerHTML = `
      <div class="article-not-found">
        <h1>Haber bulunamadı</h1>
        <p>Aradığınız haber mevcut değil veya bağlantı hatalı.</p>
        <a href="/">Ana sayfaya dön</a>
      </div>
    `;
    return;
  }

  /* SAYFA BAŞLIĞI */
  document.title = `${haber.baslik} | NABIZ`;

  /* HABERİ GÖSTER */
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
      <span>${haber.saat || ""}</span>
      <span>${haber.kaynak || "NABIZ"}</span>
    </div>

    <img
      class="article-image"
      src="${haber.gorsel}"
      alt="${haber.baslik}"
      loading="eager"
    >

    <div class="article-text">
      ${haber.icerik}
    </div>
  `;

  /* PAYLAŞIM */
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(haber.baslik);

  /* WHATSAPP */
  const whatsappShare = document.getElementById("whatsappShare");

  if (whatsappShare) {
    whatsappShare.href =
      `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  }

  /* X */
  const xShare = document.getElementById("xShare");

  if (xShare) {
    xShare.href =
      `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  }

  /* LINK KOPYALA */
  const copyShare = document.getElementById("copyShare");

  if (copyShare) {

    copyShare.addEventListener("click", async () => {

      try {

        await navigator.clipboard.writeText(url);

        copyShare.textContent = "Kopyalandı ✓";

        setTimeout(() => {
          copyShare.textContent = "Linki Kopyala";
        }, 2000);

      } catch (error) {

        alert("Link kopyalanamadı.");

      }

    });

  }

  /* TELEFON / TARAYICI PAYLAŞ */
  const nativeShare = document.getElementById("nativeShare");

  if (nativeShare) {

    nativeShare.addEventListener("click", async () => {

      if (navigator.share) {

        try {

          await navigator.share({
            title: haber.baslik,
            text: haber.spot,
            url: url
          });

        } catch (error) {
          // Kullanıcı paylaşımı iptal ettiyse hata gösterme
        }

      } else {

        try {

          await navigator.clipboard.writeText(url);

          nativeShare.textContent = "Link Kopyalandı ✓";

          setTimeout(() => {
            nativeShare.textContent = "Paylaş";
          }, 2000);

        } catch (error) {

          alert("Paylaşım desteklenmiyor.");

        }

      }

    });

  }

});
