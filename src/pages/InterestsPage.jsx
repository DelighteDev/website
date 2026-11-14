import { Link } from "react-router-dom";
import { ArtworkGrid, ArtworkSpotlight } from "../components/Artwork";
import WavyHeading from "../components/WavyHeading";
import {
  currentGame,
  currentShow,
  favouriteGame,
  favouriteShow,
  otherGames,
  otherShows,
  setup,
} from "../data/interests";

export default function InterestsPage() {
  return (
    <div className="interests-page page-section">
      <WavyHeading as="h1" className="page-heading">
        What I Like
      </WavyHeading>

      <div className="interest-pair">
        <section className="interest-section" aria-label="Favourite Game of All Time">
          <WavyHeading as="h2">Favourite Game of All Time</WavyHeading>
          <ArtworkSpotlight item={favouriteGame} />
        </section>

        <section className="interest-section" aria-label="Current Obsession">
          <WavyHeading as="h2">Current Obsession</WavyHeading>
          <ArtworkSpotlight item={currentGame} />
        </section>
      </div>

      <section className="interest-section" aria-label="Other Favourites">
        <WavyHeading as="h2">
          Other Favourites (still play some of them to this day!)
        </WavyHeading>
        <ArtworkGrid
          items={otherGames}
          renderCaption={(item) =>
            item.name === "Doki Doki Literature Club!" ? (
              <>
                Doki Doki Literature Club
                <Link className="secret-horror-entry" to="/ab0ut" aria-label="Doki Doki Literature Club!">
                  !
                </Link>
              </>
            ) : (
              item.name
            )
          }
        />
      </section>

      <section className="interest-section setup-section" aria-labelledby="setup-heading">
        <WavyHeading as="h2">
          <span id="setup-heading">Current Setup</span>
        </WavyHeading>
        <dl className="setup-list">
          {setup.map((part) => (
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
            <ArtworkSpotlight item={favouriteShow} />
          </div>

          <div className="show-subsection">
            <h3>Current Obsession</h3>
            <ArtworkSpotlight item={currentShow} />
          </div>
        </div>

        <div className="show-subsection">
          <h3>Other favourites (to name a very select few)</h3>
          <ArtworkGrid items={otherShows} />
        </div>
      </section>
    </div>
  );
}
