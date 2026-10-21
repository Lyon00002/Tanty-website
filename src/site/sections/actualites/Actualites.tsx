import { NEWS } from "./news";
import { NewsCarousel } from "./NewsCarousel";

/** Nos actualités: TANTY's news, in the layout of olamagri.com's "Latest News". */
export function Actualites() {
  return (
    <section id="actualites" aria-labelledby="nid-news-title" className="nid-on-white scroll-mt-20 overflow-x-clip pb-20 pt-14 lg:pb-28 lg:pt-16">
      <div className="nid-wrap">
        <h2 data-reveal="" id="nid-news-title" className="nid-title">
          Nos actualités
          <span className="nid-dot">.</span>
        </h2>
        <div className="mt-10">
          <NewsCarousel items={NEWS} />
        </div>
      </div>
    </section>
  );
}
