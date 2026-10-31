import { FEATURED } from "@/data/featured";
import { TRENDING } from "@/data/trending";
import { RECENTLY_ADDED } from "@/data/recently-added";
import { CATEGORIES } from "@/data/categories";

export function HeroTerminal() {
  return (
    <section className="min-h-screen bg-[#0F0F2B] text-[#F0F0F5] selection:bg-[#FF6B9D]/20 font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[#1A1A3A] bg-[#0F0F2B]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="font-serif text-xl tracking-tight text-[#F0F0F5]">
            Anime Watch
          </a>
          <div className="flex items-center gap-8 text-[14px] text-[#9A95B8]">
            <a href="#" className="transition-colors hover:text-[#F0F0F5]">Watchlist</a>
            <a href="#" className="transition-colors hover:text-[#F0F0F5]">Browse</a>
            <a href="#" className="transition-colors hover:text-[#F4C542]">Sign in</a>
          </div>
        </div>
      </nav>

      {/* Hero: image-led, asymmetric */}
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-4 md:pt-24 md:pb-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6 items-start">
          {/* Left text */}
          <div className="lg:col-span-5 lg:pt-8">
            <h1 className="font-serif text-[clamp(40px,6vw,72px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#F0F0F5]">
              The season's
              <br />
              <span className="text-[#9A95B8]">most watched.</span>
            </h1>
            <p className="mt-6 max-w-[58ch] text-[16px] leading-[1.65] text-[#9A95B8]">
              Real titles, real episodes, real banners. No templates, no generic cards — just the anime that defines the season, laid out like a page in a magazine you'd actually keep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat}
                  href="#"
                  className="rounded-none border border-[#F4C542]/30 px-4 py-2 text-[13px] font-medium text-[#F4C542] transition-colors hover:border-[#F4C542] hover:bg-[#F4C542]/10"
                >
                  {cat}
                </a>
              ))}
            </div>
          </div>

          {/* Right: large featured banner */}
          <div className="lg:col-span-7">
            <a href="#" className="group block">
              <figure className="overflow-hidden">
                <img
                  src={FEATURED[0].img_url}
                  alt={FEATURED[0].title}
                  className="aspect-[21/9] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
                <figcaption className="mt-4 flex items-baseline justify-between border-t border-[#1A1A3A] pt-4">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold tracking-tight text-[#F0F0F5]">{FEATURED[0].title}</h2>
                    <p className="mt-1 text-[15px] text-[#9A95B8]">{FEATURED[0].subtitle}</p>
                  </div>
                  <span className="font-mono text-[13px] text-[#FF6B9D]">{FEATURED[0].year}</span>
                </figcaption>
              </figure>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Featured — image-led rows, not cards */}
        <section className="border-t border-[#1A1A3A] pt-16 pb-6">
          <div className="grid lg:grid-cols-12 lg:gap-8">
            <h2 className="lg:col-span-6 font-serif text-[28px] font-semibold tracking-tight text-[#F0F0F5] leading-[1.15]">
              Featured
            </h2>
            <p className="lg:col-start-8 text-[15px] leading-[1.6] text-[#9A95B8]">
              Each row carries the image first. No rounded card kit, no uniform borders — just hairline rules separating information.
            </p>
            <span className="mt-2 font-mono text-[13px] text-[#9A95B8]/60">01. Featured â†’</span>
          </div>
        </section>

        <div className="divide-y divide-[#1A1A3A]">
          {FEATURED.slice(1, 5).map((anime) => (
            <a
              key={anime.title}
              href="#"
              className="group grid gap-6 py-8 md:grid-cols-12 md:gap-8 lg:items-center transition-colors hover:bg-[#1A1A3A]/20 -mx-6 px-6 lg:-mx-0 lg:px-0"
            >
              <div className="md:col-span-4 overflow-hidden">
                <img
                  src={anime.img_url}
                  alt={anime.title}
                  className="aspect-[16/9] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="md:col-span-8">
                <div className="flex items-center gap-3 font-mono text-[12px] text-[#FF6B9D] tracking-wide">
                  <span>{anime.genre}</span>
                  <span className="text-[#9A95B8]/30">/</span>
                  <span className="text-[#9A95B8]">{anime.year}</span>
                </div>
                <h3 className="mt-2 font-serif text-[22px] font-medium tracking-tight text-[#F0F0F5] leading-[1.2]">{anime.title}</h3>
                <p className="mt-2 text-[15px] text-[#9A95B8] leading-[1.6]">{anime.subtitle}</p>
                <div className="mt-4 flex items-center gap-4 font-mono text-[13px] text-[#9A95B8]">
                  <span>{anime.season}</span>
                  <span className="text-[#1A1A3A]">|</span>
                  <span>{anime.time}</span>
                  <span className="text-[#1A1A3A]">|</span>
                  <span>Ep: <span className="text-[#F4C542]">{anime.episode_title}</span></span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Recently added — dense list */}
        <section className="border-t border-[#1A1A3A] pt-16 pb-6">
          <div className="grid lg:grid-cols-12 lg:gap-8">
            <h2 className="lg:col-span-6 font-serif text-[28px] font-semibold tracking-tight text-[#F0F0F5] leading-[1.15]">
              Recently added
            </h2>
            <p className="lg:col-start-8 text-[15px] leading-[1.6] text-[#9A95B8]">
              New episodes join the index quietly. No badges, no flags — just the list.
            </p>
            <span className="mt-2 font-mono text-[13px] text-[#9A95B8]/60">03. Recently added â†’</span>
          </div>
        </section>

        <div className="border-t border-[#1A1A3A] divide-y divide-[#1A1A3A]">
          {RECENTLY_ADDED.map((item) => (
            <a key={item.title} href="#" className="group flex items-start gap-5 py-5 transition-colors hover:bg-[#1A1A3A]/30">
              <div className="h-16 w-12 shrink-0 overflow-hidden border border-[#1A1A3A]">
                <img src={item.img} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium text-[#F0F0F5]">{item.title}</h3>
                <p className="mt-1 text-[13px] text-[#9A95B8]">{item.genre} â€” {item.ep} â€” {item.len}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Trending — dense definition list / table */}
        <section className="border-t border-[#1A1A3A] pt-16 pb-16">
          <div className="grid lg:grid-cols-12 lg:gap-8">
            <h2 className="lg:col-span-6 font-serif text-[28px] font-semibold tracking-tight text-[#F0F0F5] leading-[1.15]">
              Trending
            </h2>
            <p className="lg:col-start-8 text-[15px] leading-[1.6] text-[#9A95B8]">
              Real numbers, no glowing stat cards. The table is the only design the data needs.
            </p>
            <span className="mt-2 font-mono text-[13px] text-[#9A95B8]/60">02. Trending â†’</span>
          </div>

          <div className="mt-8">
            <table className="w-full text-[14px] leading-[1.65]">
              <thead className="border-b border-[#1A1A3A] text-[11px] font-mono uppercase tracking-widest text-[#9A95B8]">
                <tr>
                  <th className="py-3 text-left font-normal">Title</th>
                  <th className="py-3 text-left font-normal">Genre</th>
                  <th className="py-3 text-left font-normal">Ep</th>
                  <th className="py-3 text-left font-normal">Year</th>
                  <th className="py-3 text-left font-normal">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A3A]/50">
                {TRENDING.map((t) => (
                  <tr key={t.title} className="transition-colors hover:bg-[#1A1A3A]/20">
                    <td className="py-3.5 font-medium text-[#F0F0F5]">{t.title}</td>
                    <td className="py-3.5 text-[#FF6B9D]">{t.genre}</td>
                    <td className="py-3.5 text-[#F4C542]">{t.ep}</td>
                    <td className="py-3.5 text-[#9A95B8]">{t.year}</td>
                    <td className="py-3.5 text-[#9A95B8]">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1A1A3A] bg-[#0F0F2B]">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-serif text-xl tracking-tight text-[#F0F0F5]">Anime Watch</span>
            <p className="mt-2 text-[14px] text-[#9A95B8] leading-[1.6]">Built with real content. No template defaults.</p>
          </div>
          <div className="font-mono text-[13px] text-[#9A95B8]/40">
            2026 â€” MIT
          </div>
        </div>
      </footer>
    </section>
  );
}
