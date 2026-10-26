import { useEffect, useState } from "react";

export function Artwork({ item, featured = false }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [item.image]);

  if (!item.image || failed) {
    return (
      <div className={`name-tile ${featured ? "is-featured" : ""}`} role="img" aria-label={item.name}>
        <span>{item.name}</span>
      </div>
    );
  }

  return (
    <img
      className={`artwork-image ${featured ? "is-featured" : ""}`}
      src={item.image}
      alt={`${item.name} artwork`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export function ArtworkSpotlight({ item }) {
  return (
    <div className="artwork-spotlight">
      <div className="artwork-frame">
        <Artwork item={item} featured />
      </div>
      <h3>{item.name}</h3>
    </div>
  );
}

export function ArtworkGrid({ items }) {
  return (
    <div className="artwork-grid">
      {items.map((item) => (
        <figure className="artwork-item" key={item.name}>
          <div className="artwork-frame">
            <Artwork item={item} />
          </div>
          <figcaption>{item.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}
