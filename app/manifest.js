export default function manifest() {
  return {
    name: "Nano AI - Nano Zeka, Makro Başarı",
    short_name: "Nano AI",
    description:
      "Yapay zeka destekli kişiselleştirilmiş eğitim platformu. En küçük detaylarda büyük farklar yaratıyoruz.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3B82F6",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["education", "productivity"],
    lang: "tr",
    dir: "ltr",
  };
}
