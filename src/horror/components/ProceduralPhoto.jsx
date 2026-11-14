import { useEffect, useRef } from "react";
import { drawCustomPhoto, drawGeneratedPhoto } from "../photoScenes";

export default function ProceduralPhoto({ photo, large = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = canvasRef.current;
    if (!photo.image) {
      drawGeneratedPhoto(canvas, photo);
    } else {
      const image = new Image();
      image.onload = () => {
        if (!cancelled) drawCustomPhoto(canvas, image, photo);
      };
      image.onerror = () => {
        if (!cancelled) drawGeneratedPhoto(canvas, photo);
      };
      image.src = photo.image;
    }
    return () => {
      cancelled = true;
    };
  }, [photo]);

  return (
    <canvas
      ref={canvasRef}
      className={`procedural-photo ${large ? "is-large" : ""}`}
      role="img"
      aria-label={photo.alt}
    />
  );
}
