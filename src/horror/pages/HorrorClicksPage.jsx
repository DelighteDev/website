import { useCallback, useState } from "react";
import WavyHeading from "../../components/WavyHeading";
import HorrorLightbox from "../components/HorrorLightbox";
import ProceduralPhoto from "../components/ProceduralPhoto";
import { horrorPhotos } from "../data/photos";

export default function HorrorClicksPage() {
  const [selectedId, setSelectedId] = useState(null);
  const closeViewer = useCallback(() => setSelectedId(null), []);
  const selectPhoto = useCallback((id) => setSelectedId(id), []);

  return (
    <div className="clicks-page page-section horror-clicks">
      <WavyHeading as="h1" className="page-heading">Clicks</WavyHeading>
      <div className="photo-wall">
        {horrorPhotos.map((photo, index) => (
          <figure className={`photo-frame horror-photo-frame photo-shape-${index % 4}`} key={photo.id}>
            <button
              type="button"
              className="photo-open"
              onClick={() => setSelectedId(photo.id)}
              aria-label={photo.alt}
            >
              <ProceduralPhoto photo={photo} />
            </button>
            {photo.caption && <figcaption className="photo-caption"><span>{photo.caption}</span></figcaption>}
          </figure>
        ))}
      </div>
      {selectedId && (
        <HorrorLightbox
          photos={horrorPhotos}
          selectedId={selectedId}
          onClose={closeViewer}
          onSelect={selectPhoto}
        />
      )}
    </div>
  );
}
