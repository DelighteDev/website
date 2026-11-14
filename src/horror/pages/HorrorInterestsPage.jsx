import { useEffect, useRef, useState } from "react";
import WavyHeading from "../../components/WavyHeading";
import { CorruptedGrid, CorruptedSpotlight } from "../components/CorruptedArtwork";
import {
  horrorCurrentGame,
  horrorCurrentShow,
  horrorFavouriteGame,
  horrorFavouriteShow,
  horrorGames,
  horrorSetup,
  horrorShows,
} from "../data/interests";

export default function HorrorInterestsPage() {
  const [flashId, setFlashId] = useState(null);
  const lastScroll = useRef(0);
  const lastFlash = useRef(0);
  const flashTimer = useRef(null);
  const stopTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const now = performance.now();
      const movingDown = window.scrollY > lastScroll.current + 3;
      lastScroll.current = window.scrollY;
      window.clearTimeout(stopTimer.current);
      stopTimer.current = window.setTimeout(() => setFlashId(null), 150);

      if (!movingDown || now - lastFlash.current < 6500 + Math.random() * 5000) return;
      lastFlash.current = now;
      const item = horrorGames[Math.floor(Math.random() * horrorGames.length)];
      setFlashId(item.id);
      window.clearTimeout(flashTimer.current);
      flashTimer.current = window.setTimeout(() => setFlashId(null), 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(flashTimer.current);
      window.clearTimeout(stopTimer.current);
    };
  }, []);

  return (
    <div className="interests-page page-section horror-interests">
      <WavyHeading as="h1" className="page-heading">What I Like</WavyHeading>

      <div className="interest-pair">
        <section className="interest-section" aria-label="Favourite Game of All Time">
          <WavyHeading as="h2">Favourite Game of All Time</WavyHeading>
          <CorruptedSpotlight item={horrorFavouriteGame} />
        </section>
        <section className="interest-section" aria-label="Current Obsession">
          <WavyHeading as="h2">Current Obsession</WavyHeading>
          <CorruptedSpotlight item={horrorCurrentGame} />
        </section>
      </div>

      <section className="interest-section" aria-label="Other Favourites">
        <WavyHeading as="h2">Other Favourites (still play some of them to this day!)</WavyHeading>
        <CorruptedGrid items={horrorGames} flashId={flashId} />
      </section>

      <section className="interest-section setup-section" aria-labelledby="horror-setup-heading">
        <WavyHeading as="h2"><span id="horror-setup-heading">Current Setup</span></WavyHeading>
        <dl className="setup-list">
          {horrorSetup.map((part) => (
            <div className="setup-row" key={part.label}>
              <dt>{part.label}</dt>
              <dd>{part.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="interest-section tv-section" aria-label="TV / Anime">
        <WavyHeading as="h2">TV / Anime</WavyHeading>
        <div className="interest-pair show-pair">
          <div className="show-subsection">
            <h3>Favourite Show of All Time</h3>
            <CorruptedSpotlight item={horrorFavouriteShow} />
          </div>
          <div className="show-subsection">
            <h3>Current Obsession</h3>
            <CorruptedSpotlight item={horrorCurrentShow} />
          </div>
        </div>
        <div className="show-subsection">
          <h3>Other favourites (to name a very select few)</h3>
          <CorruptedGrid items={horrorShows} />
        </div>
      </section>
    </div>
  );
}
