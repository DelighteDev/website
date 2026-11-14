import { useCallback, useMemo, useState } from "react";
import WavyHeading from "../../components/WavyHeading";
import HorrorLightbox from "../components/HorrorLightbox";
import ProceduralPhoto from "../components/ProceduralPhoto";
import { horrorPhotos } from "../data/photos";

const replacementCaptions = [
  "This was not the same photo a moment ago.",
  "Look closer.",
  "You already opened this one.",
  "The room was empty before.",
];

export default function HorrorClicksPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [captionOverrides, setCaptionOverrides] = useState({});
  const photos = useMemo(
    () => horrorPhotos.map((photo) => ({
      ...photo,
      caption: captionOverrides[photo.id] ?? photo.caption,
    })),
    [captionOverrides],
  );

  const closeViewer = useCallback(() => {
    if (selectedId && Math.random() < 0.15) {
      const others = horrorPhotos.filter((photo) => photo.id !== selectedId);
      const target = others[Math.floor(Math.random() * others.length)];
      const caption = replacementCaptions[Math.floor(Math.random() * replacementCaptions.length)];
      setCaptionOverrides((current) => ({ ...current, [target.id]: caption }));
    }
    setSelectedId(null);
  }, [selectedId]);
  const selectPhoto = useCallback((id) => setSelectedId(id), []);

  return (
    <div className="clicks-page page-section horror-clicks">
      <WavyHeading as="h1" className="page-heading">Clicks</WavyHeading>
      <div className="photo-wall">
        {photos.map((photo, index) => (
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
          photos={photos}
          selectedId={selectedId}
          onClose={closeViewer}
          onSelect={selectPhoto}
        />
      )}
    </div>
  );
}
