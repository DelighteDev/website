import { useCallback, useState } from "react";
import PhotoLightbox from "../../components/PhotoLightbox";
import WavyHeading from "../../components/WavyHeading";
import { horrorPhotos } from "../data/photos";

function PhotoCaption({ photo }) {
  if (!photo.title && !photo.place && !photo.date && !photo.camera) return null;

  return (
    <figcaption className="photo-caption">
      {photo.title && <strong>{photo.title}</strong>}
      {photo.place && <span>{photo.place}</span>}
      {photo.date && <span>{photo.date}</span>}
      {photo.camera && <span>{photo.camera}</span>}
    </figcaption>
  );
}

export default function HorrorClicksPage() {
  const [selectedId, setSelectedId] = useState(null);
  const availablePhotos = horrorPhotos.filter((photo) => photo.src);
  const closeViewer = useCallback(() => setSelectedId(null), []);
  const selectPhoto = useCallback((id) => setSelectedId(id), []);

  return (
    <div className="clicks-page page-section horror-clicks">
      <WavyHeading as="h1" className="page-heading">
        Clicks
      </WavyHeading>

      <div className="photo-wall">
        {horrorPhotos.map((photo, index) => (
          <figure className={`photo-frame horror-photo-frame photo-shape-${index % 4}`} key={photo.id}>
            {photo.src ? (
              <button
                type="button"
                className="photo-open"
                onClick={() => setSelectedId(photo.id)}
                aria-label={photo.alt || photo.title}
              >
                <img
                  src={photo.src}
                  alt={photo.alt || photo.title}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ) : (
              <div className="photo-placeholder">
                <span>Photo coming soon</span>
              </div>
            )}
            <PhotoCaption photo={photo} />
          </figure>
        ))}
      </div>

      {selectedId && (
        <PhotoLightbox
          photos={availablePhotos}
          selectedId={selectedId}
          onClose={closeViewer}
          onSelect={selectPhoto}
        />
      )}
    </div>
  );
}
